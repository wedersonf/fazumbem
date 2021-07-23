import styled from 'styled-components';
import { Button } from '~/components/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled.div`
  max-width: 1120px;
  width: 100%;

  margin: 2rem 0;

  border-radius: 1rem;

  h1 {
    color: var(--heading);
    font-size: 1.5rem;
    margin-top: 2rem;
  }

  p {
    color: var(--text);
    font-size: 1rem;
    margin-top: 1rem;
  }

  header {
    position: relative;
    height: 25rem;

    display: flex;
    justify-content: center;

    background: var(--gray);

    border-top-left-radius: inherit;
    border-top-right-radius: inherit;

    h1 {
      font-size: 1.5rem;
    }

    @media (max-width: 991.98px) {
    }

    @media (max-width: 767.98px) {
    }

    @media (max-width: 575.98px) {
    }
  }

  main {
    padding: 2rem;
    background: var(--white);
  }
`;

export const Verify = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: var(--green);
  height: 6rem;
  width: 6rem;

  border-radius: 1rem;

  color: var(--white);

  span {
    font-size: 1rem;
  }
`;

export const MapContainer = styled.div`
  height: 25rem;
  margin: 1.5rem 0;
`;

export const Contacts = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  div {
    margin: 0 auto;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        margin-right: 1rem;
        color: var(--blue);
      }

      p {
        margin: auto 0;
        line-height: 2rem;
      }
    }
  }

  @media (max-width: 575.98px) {
    grid-template-columns: 1fr;
    margin-top: 1.5rem;
  }
`;

export const ButtonContent = styled(Button)`
  width: 20rem;
  background: var(--green);

  margin: auto;

  :hover {
    border-color: var(--green);
    background: var(--white);
    color: var(--green);
  }

  @media (max-width: 575.98px) {
    margin-top: 1.5rem;
  }
`;
