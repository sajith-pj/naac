import React, { useState, useEffect } from "react";
import ModalCom from "../../../components/modal";
import {
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";

function EditFileModal({
  showUpdateFileModal,
  closeUpdateFileModal,
  selectedFile = {},
  updateFileField,
}) {
  const [value, setValue] = useState({});
  useEffect(() => {
    if (Object.keys(selectedFile).length > 0) {
      setValue(selectedFile);
    }
  }, [selectedFile]);

  const handleQuestionChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
      name: e.target.value,
    });
  };

  return (
    <ModalCom
      open={showUpdateFileModal}
      title={"Update File Field"}
      toggle={closeUpdateFileModal}
      size="lg"
    >
      <ModalBody>
        <Row>
          <Col
            xs="1"
            className="mt-2 d-flex justify-content-center align-items-center"
          >
            <Input type="checkbox" checked={true} disabled />
          </Col>
          <Col
            xs="6"
            className="mt-2 d-flex justify-content-center align-items-start flex-column"
          >
            <Label className="mb-0">Filed Name</Label>
            <Input
              type="text"
              name={value.name_for_filter}
              value={value[value.name_for_filter]}
              onChange={handleQuestionChange}
            />
          </Col>
          <Col xs="3" className="mt-2">
            <Label className="mb-0">Order</Label>
            <Input
              type="number"
              name="field_order"
              onChange={handleQuestionChange}
              value={value.field_order}
            />
          </Col>
          <Col
            xs="2"
            className="mt-2 d-flex justify-content-center align-items-center"
          >
            <div className="mt-3">
              <Input
                type="checkbox"
                name={value.name_for_filter}
                id={value.name_for_filter}
                onChange={(e) =>
                  setValue({ ...value, is_required: e.target.checked })
                }
                checked={value.is_required}
              />
              <Label className="mb-0 ms-2 " htmlFor={value.name_for_filter}>
                Required
              </Label>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button size="sm" outline onClick={closeUpdateFileModal}>
          Cancel
        </Button>
        <Button
          size="sm"
          color="primary"
          onClick={() => updateFileField(value)}
          disabled={!value[value.name_for_filter]}
        >
          Update
        </Button>
      </ModalFooter>
    </ModalCom>
  );
}

export default EditFileModal;
