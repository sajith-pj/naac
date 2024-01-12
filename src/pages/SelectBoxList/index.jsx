import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Row,
  Col,
  Input,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import Swal from "sweetalert2";
import axios from "../../axios";
import DataTable from "../../components/data-table";
import ModalCom from "../../components/modal";
import { isRequired } from "../../utils/validators";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";

const SelectBoxList = () => {
  const [loader, setLoader] = useState(false);
  const [selectBoxOptionValue, setSelectBoxOptionValue] = useState("");
  const [selectBoxOption, setSelectBoxOption] = useState([]);
  const [newSelectBoxOptions, setNewSelectBoxOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState({});
  const [inputValues, setInputValues] = useState({
    status: true,
    name: "",
  });
  const [updating, setUpdating] = useState(false);
  const column = [
    { title: "Code", field: "code" },
    { title: "Name", field: "name" },
    {
      title: "Status",
      field: "status",
      render: (rowData) => {
        return (
          <>
            {rowData.status ? (
              <Button
                color="danger"
                size="sm"
                onClick={() => updateStatus("disable", rowData.id)}
              >
                Disable
              </Button>
            ) : (
              <Button
                color="success"
                size="sm"
                onClick={() => updateStatus("enable", rowData.id)}
              >
                Enable
              </Button>
            )}
          </>
        );
      },
    },
    {
      render: (data) => {
        return (
          <button
            className="btn bg-transparent"
            onClick={() => {
              axios
                .get(`/criterion/select-box/${data.api_uuid}`)
                .then((response) => {
                  let data = response.data.data;
                  setOpen(true);
                  setInputValues({
                    name: data.name,
                    status: data.status,
                    api_uuid: data.api_uuid,
                  });
                  setNewSelectBoxOptions(data.options);
                });
            }}
          >
            <EditIcon />
          </button>
        );
      },
    },
  ];
  const addDropdown = () => {
    setOpen(true);
    setErr({});
  };

  useEffect(() => {
    getSelectBox();
  }, []);

  const getSelectBox = () => {
    setLoader(true);
    axios
      .get("criterion/select-box-list")
      .then((response) => {
        setSelectBoxOption(response?.data?.data);
        setLoader(false);
      })
      .catch((err) => console.error(err));
  };

  const updateStatus = (type, id) => {
    setLoader(true);
    axios
      .post(`/change-status`, {
        slug: "batch",
        objid: id,
        status: type === "disable" ? false : true,
      })
      .then((response) => {
        toast.success("Batch status updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        getSelectBox();
      })
      .catch(() => setLoader(false));
  };

  const closeModal = () => {
    setOpen(false);
    setInputValues({ ...inputValues, name: "" });
    setErr({});
  };

  const handleChange = (e) => {
    if (e.target.name === "status") {
      setInputValues({ ...inputValues, [e.target.name]: e.target.checked });
    } else {
      setInputValues({ ...inputValues, [e.target.name]: e.target.value });
    }
    setErr({ ...err, [e.target.name]: "" });
  };

  const deleteBatch = () => {
    Swal.fire({
      icon: "warning",
      text: "Do you want to delete!",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdating(true);
        axios
          .delete(`/programs/batch/details/${inputValues?.id}`, {})
          .then(() => {
            toast.success("Select Box deleted successfully", {
              position: "top-right",
              autoClose: 2000,
            });
            closeModal();
            getSelectBox();
          })
          .catch(() => {
            setUpdating(false);
          });
      }
    });
  };

  const submitBatch = () => {
    let errObj = {
      name: isRequired(inputValues.name),
    };
    if (Object.values(errObj).some((val) => val !== "")) {
      setErr(errObj);
      return;
    } else if (inputValues?.api_uuid) {
      setUpdating(true);
      axios
        .put(`/criterion/select-box/${inputValues?.api_uuid}`, {
          ...inputValues,
          options: newSelectBoxOptions,
        })
        .then((response) => {
          toast.success("Batch updated successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          closeModal();
          setNewSelectBoxOptions([]);
          setSelectBoxOptionValue("");
          getSelectBox();
        })
        .catch((err) => {
          let msgData = err?.response?.data?.data || {};
          setErr(msgData);
        })
        .finally(() => setUpdating(false));
    } else {
      setUpdating(true);
      axios
        .post("/criterion/select-box-list", inputValues)
        .then((response) => {
          toast.success("Select Box added successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          closeModal();
          setNewSelectBoxOptions([]);
          setSelectBoxOptionValue("");
          getSelectBox();
        })
        .catch((err) => {
          let msgData = err?.response?.data?.data || {};
          setErr(msgData);
        })
        .finally(() => setUpdating(false));
    }
  };

  const editBatch = (data) => {
    setOpen(true);
    setInputValues(data);
    setErr({});
  };

  const addOptions = () => {
    let arr = [...newSelectBoxOptions];
    if (selectBoxOptionValue) {
      arr.push({ key: arr.length + 1, value: selectBoxOptionValue });
      setNewSelectBoxOptions([...arr]);
      setInputValues((prevValues) => {
        return { ...prevValues, options: [...arr] };
      });
      setSelectBoxOptionValue("");
    }
    setErr({ ...err, selectBoxOptions: "" });
  };

  const handleDelete = (data) => {
    let arr = newSelectBoxOptions.filter((val) => val !== data);
    setNewSelectBoxOptions(arr);
  };

  return (
    <Row>
      <div className="pagetitle">
        <h1>Select Box List</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Features</li>
            <li className="breadcrumb-item active">Select Box List</li>
          </ol>
        </nav>
      </div>

      <Col xs="12" className="d-flex justify-content-end">
        <Button
          onClick={() => addDropdown()}
          className="me-2"
          outline
          color="primary"
          size="sm"
        >
          Add Custom Selectbox
        </Button>
      </Col>
      <Col xs="12">
        <div className="mt-2">
          <DataTable
            title={"Select Box List"}
            loading={loader}
            column={column}
            data={selectBoxOption}
            editBatch={editBatch}
          />
        </div>
      </Col>

      <ModalCom
        open={open}
        title={`${inputValues?.id ? "Update Dropdown" : "Add Dropdown"}`}
        toggle={closeModal}
      >
        <ModalBody>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={inputValues?.name}
                  invalid={!!err.name}
                />
                <FormFeedback>{err.name}</FormFeedback>
              </FormGroup>
            </Col>
            <Col xs="9">
              <FormGroup>
                <Label>Enter Options</Label>
                <Input
                  type="text"
                  invalid={!!err.selectBoxOptions}
                  name="select_box_options"
                  value={selectBoxOptionValue}
                  onChange={(e) => setSelectBoxOptionValue(e.target.value)}
                />
                <FormFeedback>{err?.selectBoxOptions}</FormFeedback>
              </FormGroup>
            </Col>
            <Col xs="3">
              <FormGroup>
                <Button
                  style={{ marginTop: "35px" }}
                  onClick={addOptions}
                  //   disabled={!selectBoxOptionValue}
                  size="sm"
                >
                  <i className="bi bi-plus"></i>
                </Button>
              </FormGroup>
            </Col>
            <Col xs={12}>
              {newSelectBoxOptions.map((val, k) => {
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

            <Col xs="12">
              <Input
                type="checkbox"
                name="status"
                checked={inputValues?.status}
                onChange={handleChange}
              />
              {"  "}
              <Label>Status</Label>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {inputValues?.id && (
            <Button
              color="danger"
              size="sm"
              disabled={updating}
              onClick={deleteBatch}
            >
              Delete
            </Button>
          )}
          <Button
            color="primary"
            size="sm"
            disabled={updating}
            onClick={submitBatch}
          >
            Submit
          </Button>
          <Button
            size="sm"
            onClick={closeModal}
            disabled={updating}
            color="secondary"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalCom>
    </Row>
  );
};

export default SelectBoxList;
