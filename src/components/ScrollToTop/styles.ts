import styled from 'styled-components';

type ShowScrollProps = {
  showScroll: boolean;
};

export const Container = styled.div<ShowScrollProps>`
  display: ${props => (props.showScroll ? 'flex' : 'none')};
  position: ${props => (props.showScroll ? 'fixed' : 'none')};
  bottom: 25px;
  right: 25px;
  background: var(--white);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  ${props => props.showScroll && 'align-items: center'};

  svg {
    width: 5rem;
    height: 5rem;
    color: var(--orange);
  }
`;
