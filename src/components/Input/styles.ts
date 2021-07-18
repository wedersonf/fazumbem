import styled, { css } from 'styled-components';

import Tooltip from '../Tooltop';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: 0.8rem;
  border: 0.2rem solid var(--white);

  & + div {
    margin-top: 1rem;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: var(--red);
    `}

  ${props =>
    props.isFocused &&
    css`
      color: var(--blue);
      border-color: var(--blue);
    `}

  ${props =>
    props.isFilled &&
    css`
      color: var(--blue);
    `}
`;

export const InputContent = styled.input`
  border: 0;
  flex: 1;
  padding: 0 1.5rem;
  border-radius: inherit;
  font-size: 1.5rem;

  ::placeholder {
    color: var(--description);
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
