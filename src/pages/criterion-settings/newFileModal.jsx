import React, { useState, useEffect } from "react";
import ModalCom from "../../components/modal";
import {
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

function NewFileModal({
  showFileModal,
  setShowFiledModal,
  recieveFileField,
  extraFileFields,
  isFromEdit = false,
}) {
  const [err, setErr] = useState({
    file1: "",
    file2: "",
    file3: "",
    file4: "",
    file5: "",
    file6: "",
    file7: "",
    file8: "",
  });

  const [file1, setFile1] = useState({
    file1: "",
    is_required: false,
    name: "file1",
  });
  const [file2, setFile2] = useState({
    file2: "",
    is_required: false,
    name: "file2",
  });
  const [file3, setFile3] = useState({
    file3: "",
    is_required: false,
    name: "file3",
  });
  const [file4, setFile4] = useState({
    file4: "",
    is_required: false,
    name: "file4",
    field_order: "",
  });
  const [file5, setFile5] = useState({
    file5: "",
    is_required: false,
    name: "file5",
    field_order: "",
  });
  const [file6, setFile6] = useState({
    file6: "",
    is_required: false,
    name: "file6",
    field_order: "",
  });
  const [file7, setFile7] = useState({
    file7: "",
    is_required: false,
    name: "file7",
    field_order: "",
  });
  const [file8, setFile8] = useState({
    file8: "",
    is_required: false,
    name: "file8",
    field_order: "",
  });

  const [checkBoxes, setCheckBoxes] = useState({
    file1: false,
    file2: false,
    file3: false,
    file4: false,
    file5: false,
    file6: false,
    file7: false,
    file8: false,
  });

  useEffect(() => {
    resetData();
  }, [showFileModal]);

  const resetData = () => {
    setFile1({ file1: "", is_required: false, name: "file1" });
    setFile2({ file2: "", is_required: false, name: "file2" });
    setFile3({ file3: "", is_required: false, name: "file3" });
    setFile4({ file4: "", is_required: false, name: "file4" });
    setFile5({ file5: "", is_required: false, name: "file5" });
    setFile6({ file6: "", is_required: false, name: "file6" });
    setFile7({ file7: "", is_required: false, name: "file7" });
    setFile8({ file8: "", is_required: false, name: "file8" });
    setCheckBoxes({
      file1: false,
      file2: false,
      file3: false,
      file4: false,
      file5: false,
      file6: false,
      file7: false,
      file8: false,
    });
    setErr({});
  };

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "file1":
        setFile1({ ...file1, [name]: value });
        break;
      case "file2":
        setFile2({ ...file2, [name]: value });
        break;
      case "file3":
        setFile3({ ...file3, [name]: value });
        break;
      case "file4":
        setFile4({ ...file4, [name]: value });
        break;
      case "file5":
        setFile5({ ...file5, [name]: value });
        break;
      case "file6":
        setFile6({ ...file6, [name]: value });
        break;
      case "file7":
        setFile7({ ...file7, [name]: value });
        break;
      case "file8":
        setFile8({ ...file8, [name]: value });
        break;
      default:
      // code block
    }
    setErr({ ...err, [name]: "" });
  };


  const handleCheckBox = (event) => {
    setCheckBoxes({ ...checkBoxes, [event.target.name]: event.target.checked });
    // SET THE REQUIRED TO FALSE IF THE FIELDS IS NOT ENABLED
    const { name } = event.target;
    switch (name) {
      case "file1":
        setFile1({ ...file1, is_required: false });
        break;
      case "file2":
        setFile2({ ...file2, is_required: false });
        break;
      case "file3":
        setFile3({ ...file3, is_required: false });
        break;
      case "file4":
        setFile4({ ...file4, is_required: false });
        break;
      case "file5":
        setFile5({ ...file5, is_required: false });
        break;
      case "file6":
        setFile6({ ...file6, is_required: false });
        break;
      case "file7":
        setFile7({ ...file7, is_required: false });
        break;
      case "file8":
        setFile8({ ...file8, is_required: false });
        break;
      default:
      // code block
    }
  };

  const handleRequiredCheckBox = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case "file1":
        setFile1({ ...file1, is_required: checked });
        break;
      case "file2":
        setFile2({ ...file2, is_required: checked });
        break;
      case "file3":
        setFile3({ ...file3, is_required: checked });
        break;
      case "file4":
        setFile4({ ...file4, is_required: checked });
        break;
      case "file5":
        setFile5({ ...file5, is_required: checked });
        break;
      case "file6":
        setFile6({ ...file6, is_required: checked });
        break;
      case "file7":
        setFile7({ ...file7, is_required: checked });
        break;
      case "file8":
        setFile8({ ...file8, is_required: checked });
        break;
      default:
      // code block
    }
  };
  const closeModal = () => {
    setShowFiledModal(false);
  };

  const submitData = () => {
    let val = Object.values(checkBoxes);
    if (val.every((val) => val === false)) {
      toast.error("Enter at least one data to submit", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    let err = {
      file1: checkBoxes.file1 && !file1.file1 ? "Required" : "",
      file2: checkBoxes.file2 && !file2.file2 ? "Required" : "",
      file3: checkBoxes.file3 && !file3.file3 ? "Required" : "",
      file4: checkBoxes.file4 && !file4.file4 ? "Required" : "",
      file5: checkBoxes.file5 && !file5.file5 ? "Required" : "",
      file6: checkBoxes.file6 && !file6.file6 ? "Required" : "",
      file7: checkBoxes.file7 && !file7.file7 ? "Required" : "",
      file8: checkBoxes.file8 && !file8.file8 ? "Required" : "",
    };
    if (Object.values(err).some((val) => val !== "")) {
      setErr(err);
      return;
    } else {
      let allDataObj = [
        { ...file1 },
        { ...file2 },
        { ...file3 },
        { ...file4 },
        { ...file5 },
        { ...file6 },
        { ...file7 },
        { ...file8 },
      ];
      let filter = allDataObj.filter((val) => val[val.name]);
      filter.forEach((value) => {
        value.status = true;
        value.name_id = uuidv4();
        value.type = "file";
        value.name_for_filter = value.name;
        value.isFromEdit = isFromEdit ? true : undefined;
      });
      recieveFileField(filter);
      toast.success("New file fields addedd successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      closeModal();
    }
  };

  const showInput = (value) => {
    return !extraFileFields.some((val) => val.name_for_filter === value);
  };

  return (
    <ModalCom
      open={showFileModal}
      title={"Add File Fields"}
      toggle={closeModal}
      size="lg"
    >
      <ModalBody>
        <Row>
          <Col xs="12">
            <h6 style={{ color: "#0a41ab" }}>
              Only images and pdf are allowed
            </h6>
          </Col>
          {showInput("file1") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file1" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file1}
                  name="file1"
                  value={file1.file1}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file1}
                />
                <FormFeedback>{err.file1}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file1}
                  onChange={handleRequiredCheckBox}
                  value={file2.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file1"
                    disabled={!checkBoxes.file1}
                    id="file-1"
                    onChange={handleRequiredCheckBox}
                    checked={file1.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-1">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}

          {showInput("file2") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file2" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file2}
                  name="file2"
                  value={file2.file2}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file2}
                />
                <FormFeedback>{err.file2}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file2}
                  onChange={handleRequiredCheckBox}
                  value={file2.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file2"
                    disabled={!checkBoxes.file2}
                    id="file-2"
                    onChange={handleRequiredCheckBox}
                    checked={file2.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-2">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}

          {showInput("file3") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file3" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file3}
                  name="file3"
                  value={file3.file3}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file3}
                />
                <FormFeedback>{err.file3}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file3}
                  onChange={handleRequiredCheckBox}
                  value={file3.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file3"
                    disabled={!checkBoxes.file3}
                    id="file-3"
                    onChange={handleRequiredCheckBox}
                    checked={file3.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-3">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}

          {showInput("file4") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file4" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file4}
                  name="file4"
                  value={file4.file4}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file4}
                />
                <FormFeedback>{err.file4}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file4}
                  onChange={handleRequiredCheckBox}
                  value={file4.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file4"
                    disabled={!checkBoxes.file4}
                    id="file-4"
                    onChange={handleRequiredCheckBox}
                    checked={file4.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-4">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}
          {showInput("file5") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file5" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file5}
                  name="file5"
                  value={file5.file5}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file5}
                />
                <FormFeedback>{err.file5}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file5}
                  onChange={handleRequiredCheckBox}
                  value={file5.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file5"
                    disabled={!checkBoxes.file5}
                    id="file-5"
                    onChange={handleRequiredCheckBox}
                    checked={file5.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-5">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}
          {showInput("file6") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file6" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file6}
                  name="file6"
                  value={file6.file6}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file6}
                />
                <FormFeedback>{err.file6}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file6}
                  onChange={handleRequiredCheckBox}
                  value={file6.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file6"
                    disabled={!checkBoxes.file6}
                    id="file-6"
                    onChange={handleRequiredCheckBox}
                    checked={file6.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-6">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}
          {showInput("file7") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file7" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file7}
                  name="file7"
                  value={file7.file7}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file7}
                />
                <FormFeedback>{err.file7}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file7}
                  onChange={handleRequiredCheckBox}
                  value={file7.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file7"
                    disabled={!checkBoxes.file7}
                    id="file-7"
                    onChange={handleRequiredCheckBox}
                    checked={file7.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-7">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}
          {showInput("file8") && (
            <>
              <Col
                xs="1"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <Input type="checkbox" name="file8" onChange={handleCheckBox} />
              </Col>
              <Col
                xs="6"
                className="mt-2 d-flex justify-content-center align-items-start flex-column"
              >
                <Label className="mb-0">Filed Name</Label>
                <Input
                  type="text"
                  invalid={!!err.file8}
                  name="file8"
                  value={file8.file8}
                  onChange={handleQuestionChange}
                  disabled={!checkBoxes.file8}
                />
                <FormFeedback>{err.file8}</FormFeedback>
              </Col>
              <Col xs="3" className="mt-2">
                <Label className="mb-0">Order</Label>
                <Input
                  type="number"
                  name="field_order"
                  disabled={!checkBoxes.file8}
                  onChange={handleRequiredCheckBox}
                  value={file8.field_order}
                />
              </Col>
              <Col
                xs="2"
                className="mt-2 d-flex justify-content-center align-items-center"
              >
                <div className="mt-3">
                  <Input
                    type="checkbox"
                    name="file8"
                    disabled={!checkBoxes.file8}
                    id="file-8"
                    onChange={handleRequiredCheckBox}
                    checked={file8.is_required}
                  />
                  <Label className="mb-0 ms-2 " htmlFor="file-8">
                    Required
                  </Label>
                </div>
              </Col>
            </>
          )}
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button size="sm" outline onClick={closeModal}>
          Close
        </Button>
        <Button size="sm" onClick={submitData}>
          Create
        </Button>
      </ModalFooter>
    </ModalCom>
  );
}

export default NewFileModal;
