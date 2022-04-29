import { Button, Modal } from 'react-bootstrap';

const EditingWindow = ({ onHide, show, state }) => (
  <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    {...{ onHide, show }}

  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        修改委託單
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Centered Modal</h4>
      <p>
        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
        consectetur ac, vestibulum at eros.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>Close</Button>
      <Button variant="outline-primary" onClick={() => console.log('送出')} > Save changes</Button>
    </Modal.Footer>
  </Modal>
);

export default EditingWindow;