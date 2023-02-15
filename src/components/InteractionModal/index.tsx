import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { ReactElement } from 'react';
import './index.scss';

const StyledHeader = styled(Modal.Header)`
`;

interface InteractionModalHeaderProps {
  value: string;
}

const StyledModal = styled(Modal)`
`;

interface InteractionModalProps {
  children: ReactElement;
  show: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  toggleShow: Function;
}

interface InteractionModalContainerProps {
  title: string;
  children: ReactElement;
  show: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  toggleShow: Function;
}

export function InteractionModalContainer({ title, show, toggleShow, children }: InteractionModalContainerProps): JSX.Element {
  return (
    <InteractionModal
      show={show}
      toggleShow={toggleShow}>
      <>
        <InteractionModalHeader value={title} />
        <InteractionModalBody>{children}</InteractionModalBody>
      </>
    </InteractionModal>
  );
}

export const InteractionModalFooter = styled(Modal.Footer)`
`;

export const InteractionModalBody = styled(Modal.Body)`
  padding: 25px;
`;

export const InteractionModalHeader = ({ value }: InteractionModalHeaderProps): JSX.Element => (
  <StyledHeader closeButton>
    <Modal.Title>
      {value}
    </Modal.Title>
  </StyledHeader>
);

export default function InteractionModal(props: InteractionModalProps): JSX.Element {
  const { show, children, toggleShow } = props;
  return (
    <StyledModal
      show={show}
      onHide={() => toggleShow(false)}>
      {children}
    </StyledModal>
  );
}
