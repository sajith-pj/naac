import React, { useState, useEffect } from "react";
import ModalCom from "../../components/modal";
import {
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { isRequired } from "../../utils/validators";
import Chip from "@material-ui/core/Chip";
import { toast } from "react-toastify";
import axios from "../../axios";

function ExtraFields({
  showFieldModal,
  extraFields,
  recieveNewField,
  editData,
  isFromEdit = false,
  closeModal,
}) {
  let initialNewFieldValue = {
    label: "",
    type: "date",
    selectBoxType: "static",
    details: "",
    status: true,
    is_required: false,
    is_editable: false,
    api_enabled: false,
    selectOptionApi: [],
    selectBoxOptions: [],
    isFromEdit: isFromEdit ? true : undefined,
    order: "",
    api: "",
    minimum: "",
    maximun: "",
  };

  const [err, setErr] = useState({
    label: "",
    type: "",
    minimum: "",
    maximum: "",
    selectBoxType: "",
    slug: "",
    order: "",
  });
  const [newFieldDetail, setNewFieldDetail] = useState(initialNewFieldValue);
  const [selectBoxOptions, setSelectBoxOptions] = useState([]);
  const [selectBoxOptionValue, setSelectBoxOptionValue] = useState("");
  const [selectOptionApi, setSelectOptionApi] = useState([]);

  useEffect(() => {
    resetData();
    if (isFromEdit) {
      setNewFieldDetail({
        ...newFieldDetail,
        ...editData,
        minimum:
          editData?.options !== undefined
            ? editData?.options[0]?.minimum_length
            : "",
        maximum:
          editData?.options !== undefined
            ? editData?.options[0]?.maximum_length
            : "",
      });
    }
  }, [showFieldModal]);

  const getSelectBoxList = () => {
    axios.get("/criterion/select-box-list").then((response) => {
      setSelectOptionApi([...selectOptionApi, ...response.data.data]);
    });
  };
  const resetData = () => {
    setNewFieldDetail(initialNewFieldValue);
    setErr({ label: "", type: "" });
    setSelectBoxOptions([]);
    setSelectBoxOptionValue("");
  };

  const addField = () => {
    let err = {
      label: isRequired(newFieldDetail.label),
      type: isRequired(newFieldDetail.type),
      order: isRequired(newFieldDetail.order),
      minimum: ["text", "textarea"].includes(newFieldDetail.type)
        ? isRequired(newFieldDetail.minimum)
        : "",
      maximum: ["text", "textarea"].includes(newFieldDetail.type)
        ? isRequired(newFieldDetail.maximum)
        : "",
      selectBoxOptions:
        newFieldDetail.type === "select_box"
          ? newFieldDetail.selectBoxType === "static" &&
            selectBoxOptions.length === 0
            ? "*Required atleast one value"
            : ""
          : "",
    };
    if(!isFromEdit){
      let isOrderExist = extraFields.find(
        (field) => field.order === newFieldDetail.order
        );
        if (isOrderExist) {
          err.order = " Order already exist";
        }
      }
    if (Object.values(err).some((val) => val !== "")) {
      setErr(err);
      return;
    }

    // SETTING DATA OBJECT FOR THE NEWFILEDdETAILS
    let data = {
      ...newFieldDetail,
      options: {
        dropdown: [...selectBoxOptions],
      },
      selectBoxOptions:
        newFieldDetail.type === "select_box" ? selectBoxOptions : [],
    };
    if (newFieldDetail.maximun !== "" || newFieldDetail.minimun !== "") {
      data.options.length = {
        minimum_length: newFieldDetail.minimum,
        maximum_length: newFieldDetail.maximum,
      };
    }
    if (
      newFieldDetail.type === "select_box" &&
      newFieldDetail.selectBoxType === "api"
    ) {
      data.api_enabled = newFieldDetail.api_enabled;
    }
    resetData();
    toast.success("New field addedd successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    recieveNewField(data);
  };
  const handleChange = (event) => {
    if (
      event.target.name === "status" ||
      event.target.name === "is_required" ||
      event.target.name === "is_editable"
    ) {
      setNewFieldDetail({
        ...newFieldDetail,
        [event.target.name]: event.target.checked,
      });
    } else if (event.target.name === "order") {
      setNewFieldDetail({
        ...newFieldDetail,
        [event.target.name]: parseInt(event.target.value),
      });
      setErr({ ...err, [event.target.name]: "" });
    } else {
      setNewFieldDetail({
        ...newFieldDetail,
        [event.target.name]: event.target.value,
      });
      setErr({ ...err, [event.target.name]: "" });
    }
  };

  const addOptions = () => {
    let arr = [...selectBoxOptions];
    if (selectBoxOptionValue) {
      arr.push({ key: arr.length + 1, value: selectBoxOptionValue });
      setSelectBoxOptions([...arr]);
      setSelectBoxOptionValue("");
    }
    setErr({ ...err, selectBoxOptions: "" });
  };

  const handleDelete = (data) => {
    let arr = selectBoxOptions.filter((val) => val !== data);
    setSelectBoxOptions(arr);
  };

  return (
    <ModalCom
      open={showFieldModal}
      title={isFromEdit ? "Edit Field" : "Add New Field"}
      toggle={closeModal}
    >
      <ModalBody>
        <Row>
          <Col xs="12">
            <FormGroup>
              <Label>Field Heading Name</Label>
              <Input
                type="text"
                name="label"
                value={newFieldDetail.label}
                onChange={handleChange}
                invalid={!!err.label}
              />
              <FormFeedback>{err.label}</FormFeedback>
            </FormGroup>
          </Col>
          <Col xs="12">
            <FormGroup>
              <Label>Field Type</Label>
              <Input
                type="select"
                name="type"
                value={newFieldDetail.type}
                onChange={handleChange}
                invalid={!!err.type}
              >
                <option value="date">Date</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="file">File</option>
                <option value="textarea">Textarea </option>
                <option value="checkbox">Checkbox </option>
                <option value="select_box">Select Box</option>
              </Input>
              <FormFeedback>{err.type}</FormFeedback>
            </FormGroup>
          </Col>
          {newFieldDetail.type === "select_box" && (
            <>
              <Col xs="12">
                <FormGroup>
                  <Label>Select Type</Label>
                  <Input
                    type="select"
                    invalid={!!err.selectBoxType}
                    name="selectBoxType"
                    value={newFieldDetail.selectBoxType}
                    onChange={(e) => {
                      if (e.target.value === "api") {
                        getSelectBoxList();
                      }
                      setNewFieldDetail({
                        ...newFieldDetail,
                        selectBoxType: e.target.value,
                        api_enabled: e.target.value === "api" ? true : false,
                      });
                    }}
                  >
                    <option value="static">Static </option>
                    <option value="api">Api </option>
                  </Input>
                  <FormFeedback>{err?.selectBoxType}</FormFeedback>
                </FormGroup>
              </Col>
              {newFieldDetail.selectBoxType == "static" ? (
                <>
                  <Col xs="9">
                    <FormGroup>
                      <Label>Enter Options</Label>
                      <Input
                        type="text"
                        invalid={!!err.selectBoxOptions}
                        name="select-box-options"
                        value={selectBoxOptionValue}
                        onChange={(e) =>
                          setSelectBoxOptionValue(e.target.value)
                        }
                      />
                      <FormFeedback>{err?.selectBoxOptions}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Button
                        style={{ marginTop: "35px" }}
                        onClick={addOptions}
                        disabled={!selectBoxOptionValue}
                        size="sm"
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    {selectBoxOptions.map((val, k) => {
                      return (
                        <Chip
                          style={{ marginLeft: "3px" }}
                          key={k}
                          label={val.value}
                          onDelete={() => handleDelete(val)}
                        />
                      );
                    })}
                  </Col>
                </>
              ) : (
                <Col xs="12">
                  <FormGroup>
                    <Label>Select Slug</Label>
                    <Input
                      type="select"
                      invalid={!!err.slug}
                      name="slug"
                      value={newFieldDetail.api}
                      onChange={(e) =>
                        setNewFieldDetail({
                          ...newFieldDetail,
                          api: e.target.value,
                        })
                      }
                    >
                      <option value="" selected disabled>
                        Select Slug
                      </option>
                      {selectOptionApi.map((option) => (
                        <option value={option.api_uuid}>{option.name}</option>
                      ))}
                    </Input>
                    <FormFeedback>{err?.slug}</FormFeedback>
                  </FormGroup>
                </Col>
              )}
            </>
          )}
          <Col xs="12">
            <FormGroup>
              <Label>Field Order</Label>
              <Input
                type="number"
                name="order"
                value={newFieldDetail.order}
                onChange={handleChange}
                invalid={!!err.order}
              />
              <FormFeedback>{err.order}</FormFeedback>
            </FormGroup>
          </Col>
          <Col xs="12">
            <FormGroup>
              <Label>Hints</Label>
              <Input
                type="text"
                name="details"
                value={newFieldDetail.details}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>

          {newFieldDetail.type === "number" ||
          newFieldDetail.type === "text" ||
          newFieldDetail.type === "textarea" ? (
            <>
              <Col xs="6">
                <FormGroup>
                  <Label>Min Character</Label>
                  <Input
                    type="number"
                    min={1}
                    name="minimum"
                    value={newFieldDetail.minimum}
                    onChange={handleChange}
                    invalid={!!err.minimum}
                  />
                  <FormFeedback>{err.minimum}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label>Max Character</Label>
                  <Input
                    type="number"
                    min={1}
                    name="maximum"
                    value={newFieldDetail.maximum}
                    onChange={handleChange}
                    invalid={!!err.maximum}
                  />
                  <FormFeedback>{err.maximum}</FormFeedback>
                </FormGroup>
              </Col>
            </>
          ) : (
            ""
          )}
          <Col xs="4">
            <Input
              type="checkbox"
              name="status"
              id="status"
              checked={newFieldDetail.status}
              onChange={handleChange}
            />
            <Label htmlFor="status" className="ms-2">
              Status
            </Label>
          </Col>
          <Col xs="4">
            <Input
              type="checkbox"
              name="is_required"
              id="is_required"
              checked={newFieldDetail.is_required}
              onChange={handleChange}
            />
            <Label htmlFor="is_required" className="ms-2">
              Required field
            </Label>
          </Col>
          <Col xs="4">
            <Input
              type="checkbox"
              name="is_editable"
              id="is_editable"
              checked={newFieldDetail.editable}
              onChange={handleChange}
            />
            <Label htmlFor="is_editable" className="ms-2">
              Editable
            </Label>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button size="sm" outline onClick={closeModal}>
          Close
        </Button>
        <Button size="sm" onClick={addField}>
          {isFromEdit ? "Update" : "Create"}
        </Button>
      </ModalFooter>
    </ModalCom>
  );
}

export default ExtraFields;
