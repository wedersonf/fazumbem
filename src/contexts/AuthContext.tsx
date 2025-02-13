import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Router, { useRouter } from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

import { api } from '~/services/apiClient';

import { permissions, roles } from '~/utils/enum';

type User = {
  id: number;
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  corporate_name?: string;
  cnpj?: number;
  description?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  postal_code?: number;
  state?: string;
  city?: string;
  main_phone?: number;
  secondary_phone?: number;
  address_latitude?: string;
  address_longitude?: string;
  role?: number;
  permission?: number;
};

type SignInCredentials = {
  email: string;
  password: string;
  type: string;
};

type SignUpData = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  corporate_name?: string;
  cnpj?: string;
  description?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  postal_code?: string;
  state?: string;
  city?: string;
  main_phone?: string;
  secondary_phone?: string;
};

export type AuthContextData = {
  signUp(data: SignUpData): Promise<void>;
  signUpCurator(data: SignUpData): Promise<void>;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOutUser(): void;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  children: ReactNode;
};

type DecodeData = {
  id: number;
  type: 'institution' | 'curator';
  admin?: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'fazumbem.token');
  destroyCookie(undefined, 'fazumbem.refreshToken');

  authChannel.postMessage('signOut');

  if (
    ![
      '/',
      '/campaigns',
      '/campaigns/[slug]',
      '/institutions',
      '/institutions/[slug]',
    ].includes(Router.pathname)
  ) {
    Router.push('/');
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  const verify = decode => {
    const role =
      decode.type === 'institution' ? roles.institution : roles.curator;

    const permission =
      decode.type === 'curator'
        ? decode.admin
          ? permissions.administrator
          : permissions.user
        : null;

    return { role, permission };
  };

  const signOutUser = useCallback(() => {
    setUser(null);
  }, []);

  const loadUser = async () => {
    try {
      const { 'fazumbem.token': token } = parseCookies();
      const decoded = jwtDecode<DecodeData>(token);

      if (token) {
        const { role, permission } = verify(decoded);

        let response;

        if (role === roles.institution) {
          response = await api.get(`institutions/${decoded.id}`);
        } else {
          response = await api.get(`curators/${decoded.id}`);
        }

        setUser({ ...response.data.data, role, permission });
      }
    } catch (err) {
      toast.error(err.response?.data.message);
      signOut();
      signOutUser();
    }
  };

  const signIn = useCallback(
    async ({ email, password, type }: SignInCredentials) => {
      try {
        const response = await api.post('login', { email, password, type });
        const { token, refreshToken } = response.data.data;

        const decoded = jwtDecode<DecodeData>(token);
        const { role, permission } = verify(decoded);

        const institution = await api.get(`institutions/${decoded.id}`);

        setCookie(undefined, 'fazumbem.token', token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        setCookie(undefined, 'fazumbem.refreshToken', refreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        setUser({ ...institution.data.data, role, permission });

        api.defaults.headers.Authorization = `Bearer ${token}`;

        toast.success('Autenticação realizada com sucesso.');
        router.push('/dashboard');
      } catch (err) {
        toast.error(err.response?.data.message);
      }
    },
    [router],
  );

  const signUp = useCallback(
    async (data: SignUpData) => {
      try {
        const response = await api.post('/institutions', data);

        if (response) {
          toast.success('Cadastro realizado com sucesso.');
          router.push('/sign');
        }
      } catch ({ response }) {
        toast.error(response.data.message);
      }
    },
    [router],
  );

  const signUpCurator = useCallback(
    async (data: SignUpData) => {
      try {
        const response = await api.post('/curators', { ...data, admin: false });

        if (response) {
          toast.success('Cadastro realizado com sucesso.');
          router.push('/sign');
        }
      } catch ({ response }) {
        toast.error(response.data.message);
      }
    },
    [router],
  );

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signUpCurator,
        signOut,
        signOutUser,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
