import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  Button,
  Card,
  CardBody,
  CardFooter,
  FormGroup,
  CardHeader,
  FormFeedback,
} from "reactstrap";
import axios from "../../axios";
import Loader from "../../components/loader";
import {
  useNavigate,
  Link,
  useParams,
  useOutletContext,
} from "react-router-dom";
import "../criterion-settings/criterion.scss";
import { toast } from "react-toastify";
import { isRequired } from "../../utils/validators";
import PermissionContext from "../../store/permissionContext";

function AddCriterionDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const { data_id = "" } = useParams();
  const user = useOutletContext();
  const ctx = useContext(PermissionContext);
  const allow_data_entry = ctx?.permissions?.allow_data_entry || false;

  const [loader, setLoader] = useState(true);
  const [departmentList, setDepartmentList] = useState([]);
  const [paperList, setPaperList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [programList, setProgramsList] = useState([]);
  const [dataField, setDataField] = useState({});
  const [answerData, setAnswerData] = useState({
    user: 1,
  }); // TO HANDLE THE STATIC AND OPTIONAL DATA SEPERATE
  const [files, setFiles] = useState([]);
  const [answerDataJoc, setAnswerDataJdoc] = useState({}); // TO HANDLE THE JDOC DATA SEPERATE
  const [submitLoader, setSubmitLoader] = useState(false);
  const [err, setErr] = useState({});

  useEffect(() => {
    if (allow_data_entry) {
      getCriterionData();
      getFeatures();
      if (data_id) getCriterionDataById();
      setUserDepartment();
    } else {
      navigate("/all-criterions");
    }
  }, []);

  const setUserDepartment = () => {
    if (
      user.user_scope === "CLUB" ||
      user.user_scope === "STAFF" ||
      user.user_scope === "HOD"
    ) {
      setAnswerData({ ...answerData, department: user?.department?.id });
    }
  };
  const getCriterionData = () => {
    axios
      .get(`/criterion/add-button/c${params.id.replaceAll(".", "_")}`)
      .then((response) => {
        let res = response?.data?.button || false;
        if (!res) navigate("/all-criterions");
      });

    axios
      .get(`/criterion/show-question-fields/c${params.id.replaceAll(".", "_")}`)
      .then((response) => {
        if (response?.data?.data) {
          let extraFields = response.data.data.extra_fields;
          extraFields.sort((a, b) => {
            if (a.order < b.order) {
              return -1;
            }
            if (a.order > b.order) {
              return 1;
            }
            return 0;
          });
          setDataField(
            { ...response?.data?.data, extra_fields: extraFields } || {}
          );
        } else setDataField({});
      })
      .finally(() => setLoader(false));
  };

  const getCriterionDataById = () => {
    axios
      .get(`/criterion/data/foreign-key/${data_id}`)
      .then((response) => {
        let res_data = response?.data?.data || {};
        // if (['PENDING', 'REVERTED'].includes(res_data?.status) && ['HOD', 'CLUB', 'STAFF'].includes(user?.user_scope)) {
        //     navigate(-1)
        // }
        setAnswerDataJdoc(res_data?.jdoc || {});
        setAnswerData({ ...res_data, user: 1 });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  const viewFile = (field) => {
    let img = answerDataJoc[field?.field_uuid][1];
    if (typeof img === "object") {
      let localFileURL = URL.createObjectURL(img);
      window.open(localFileURL, "blank");
    } else window.open(img, "blank");
  };

  const getFeatures = () => {
    axios.get("/features").then((response) => {
      const { batch, subjects, programs, departments } = response.data.data;
      setBatchList(batch);
      setDepartmentList(departments);
      setPaperList(subjects);
      setProgramsList(programs);
    });
  };

  const validateData = () => {
    let opt_fields = dataField?.field_config?.optional_fields;
    let err = {
      date: isRequired(answerData.date),
    };
    opt_fields.forEach((val) => {
      if (!answerData[val]) {
        err[val] = "*Required";
      }
    });
    dataField?.extra_fields.forEach((field) => {
      if (field.is_required) {
        if (!answerDataJoc[field?.field_uuid]) {
          err[field.field_uuid] = "*Required";
        } else if (answerDataJoc[field?.field_uuid][1] === "") {
          err[field.field_uuid] = "*Required";
        }
      }
    });

    if (Object.values(err).some((val) => val !== "")) {
      setErr(err);
      toast.warn("Fill the all required fields", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    setErr({});
    return true;
  };
  const postAnswer = (e) => {
    e.preventDefault();
    let validate = validateData();
    if (!validate) {
      return;
    }
    setSubmitLoader(true);
    if (data_id) {
      updateAnswer();
    } else {
      axios
        .post("/criterion/data/list-create", {
          ...answerData,
          status: "PENDING",
          created_by: user.id,
          criterion: dataField?.criterion,
          criterion_id: dataField?.criterion_id,
          version: dataField?.version,
          weightage: dataField?.weightage,
          jdoc: answerDataJoc,
          is_active: true,
          is_enabled: true,
          data: {
            criterion: {
              criterion_uuid: dataField?.criterion_uuid,
              question: dataField?.question,
              sub_title: dataField?.sub_title,
              main_title: dataField?.main_title,
            },
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            if (files.length > 0) {
              Promise.all([
                ...files.map((file) => {
                  return postFiles(file, response?.data?.data?.id);
                }),
              ]).then((result) => {
                let requiredObjForJdoc = {};
                result.forEach((uploadedFile) => {
                  const { label, field_uuid, file } = uploadedFile.data.data;
                  requiredObjForJdoc[field_uuid] = [label, file];
                });

                axios
                  .put(`/criterion/data/show/${response?.data?.data.id}`, {
                    jdoc: {
                      ...answerDataJoc,
                      ...requiredObjForJdoc,
                    },
                  })
                  .then((res) => {
                  });
              });
            } else {
              toast.success("Added successfully", {
                position: "top-right",
                autoClose: 2000,
              });
              setTimeout(() => {
                setSubmitLoader(false);
                navigate("/all-criterions");
              }, 1500);
            }
          }
        })
        .catch(() => {
          setSubmitLoader(false);
          toast.error("Ops, Something went wrong", {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
  };

  const postFiles = (files, id) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      for (let file in files) {
        formData.append(file, files[file]);
      }
      axios
        .post(`/criterion/file/update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          toast.success("Added Successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => {
            setSubmitLoader(false);
            navigate("/all-criterions");
          }, 1500);
          resolve(response);
        })
        .catch((error) => {
          toast.warn("Details Added, However File updation failed!", {
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => {
            setSubmitLoader(false);
            navigate("/all-criterions");
          }, 1500);
          reject(error);
        });
    });
  };

  const updateAnswer = () => {
    axios
      .put(`/criterion/data/show/${data_id}`, {
        ...answerData,
        created_by: user.id,
        criterion: dataField?.criterion,
        criteria: dataField?.criterion_id,
        jdoc: answerDataJoc,
        is_active: true,
        is_enabled: true,
        data: {
          criterion: {
            criterion_uuid: dataField?.criterion_uuid,
            question: dataField?.question,
            sub_title: dataField?.sub_title,
            main_title: dataField?.main_title,
          },
        },
        status: "PENDING",
      })
      .then((response) => {
        if (response.data.data) {
          if (files.length > 0) {
            Promise.all([
              ...files.map((file) => {
                return postFiles(file, response?.data?.data?.id);
              }),
            ]).then((result) => {
              let requiredObjForJdoc = {};
              result.forEach((uploadedFile) => {
                const { label, field_uuid, file } = uploadedFile.data.data;
                requiredObjForJdoc[field_uuid] = [label, file];
              });

              axios
                .put(`/criterion/data/show/${response?.data?.data.id}`, {
                  jdoc: {
                    ...answerDataJoc,
                    ...requiredObjForJdoc,
                  },
                })
                .then((res) => {
                });
            });
          } else {
            toast.success("Updated successfully", {
              position: "top-right",
              autoClose: 2000,
            });
            setTimeout(() => {
              setSubmitLoader(false);
              navigate("/all-criterions");
            }, 1500);
          }
        }
      })
      .catch(() => {
        setSubmitLoader(false);
        toast.error("Ops, Something went wrong", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const updatFiles = () => {
    let formData = new FormData();
    for (let file in files) {
      if (files[file] !== null) {
        formData.append(file, files[file]);
      }
    }
    axios
      .post(`/criterion/file/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Updated Successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          setSubmitLoader(false);
          navigate("/all-criterions");
        }, 1500);
      })
      .catch(() => {
        toast.warn("Details Updated, However File updation failed!", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          setSubmitLoader(false);
          navigate("/all-criterions");
        }, 1500);
      });
  };

  const handleOptionalFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setAnswerData({ ...answerData, department: Number(value) });
    } else if (name === "program") {
      setAnswerData({
        ...answerData,
        [name]: Number(value),
        paper: "",
      });
    } else {
      setAnswerData({
        ...answerData,
        [name]: Number(value),
      });
    }
    setErr({ ...err, [name]: "" });
  };
  const handleFiles = (event, field) => {
    const { field_uuid, label } = field;
    const { name } = event.target;
    const { type = "" } = event?.target?.files[0];
    const acceptMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/bmp",
      "application/pdf",
    ];
    if (!acceptMimeTypes.includes(type)) {
      toast.error("The file format is not supported", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    let criterion_uuid = dataField.criterion_uuid;
    let version = dataField.version;
    let criterion_id = dataField.criterion_id;
    setFiles([
      ...files,
      {
        criterion_uuid,
        version,
        criterion_id,
        field_uuid,
        label,
        file: event.target.files[0],
      },
    ]);
    setAnswerDataJdoc({
      ...answerDataJoc,
      [name]: [label, event.target.files[0]],
    });
    setErr({ ...err, [field?.field_uuid]: "" });
  };

  const handleJdocAnswerChange = (event, field) => {
    const { name, value, checked } = event.target;
    if (field.type === "checkbox") {
      setAnswerDataJdoc({
        ...answerDataJoc,
        [name]: [field.label, checked],
      });
    } else {
      setAnswerDataJdoc({
        ...answerDataJoc,
        [name]: [field.label, value],
      });
    }
    setErr({ ...err, [field?.field_uuid]: "" });
  };

  const handleAnswerChange = (event) => {
    setAnswerData({ ...answerData, [event.target.name]: event.target.value });
    if (event.target.name === "date") setErr({ ...err, date: "" });
  };

  if (loader)
    return <Loader title={data_id ? "Update Details" : "Add Details"} />;
  return (
    <Row className="criterion-add-details">
      <div className="pagetitle">
        <h1>{data_id ? "Update Details" : "Add Details"}</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/all-criterions">Criterions</Link>
            </li>
            <li className="breadcrumb-item active">
              {data_id ? "Update Details" : "Add Details"}
            </li>
          </ol>
        </nav>
      </div>

      <Col xs="12">
        <h5>Criteria - C {params?.id}</h5>
        <p>{dataField?.question}</p>
        <p>{dataField?.description}</p>
      </Col>

      <Col xs="1" sm="1"></Col>
      <Col xs="12" sm="10">
        <form onSubmit={postAnswer}>
          <Card>
            <CardHeader>Add Details</CardHeader>
            <CardBody>
              {dataField?.optional_fields?.length > 0
                ? dataField?.field_config?.optional_fields.map((val, ky) => {
                    return (
                      <FormGroup key={ky}>
                        <Label className="optional_fields-label">{val}</Label>
                        <Input
                          type="select"
                          name={val}
                          onChange={handleOptionalFieldChange}
                          value={answerData[val]}
                          invalid={!!err[val]}
                        >
                          <option value="">Select</option>
                          {val === "department"
                            ? departmentList.map((field, k) => {
                                if (
                                  user.user_scope === "CLUB" ||
                                  user.user_scope === "STAFF" ||
                                  user.user_scope === "HOD"
                                ) {
                                  if (field.id === user?.department?.id) {
                                    return (
                                      <option key={k} value={field.id}>
                                        {field.name}
                                      </option>
                                    );
                                  }
                                } else
                                  return (
                                    <option key={k} value={field.id}>
                                      {field.name}
                                    </option>
                                  );
                              })
                            : val === "program"
                            ? programList.map((field, k) => {
                                if (
                                  field.department === answerData?.department
                                ) {
                                  return (
                                    <option key={k} value={field.id}>
                                      {field.name}
                                    </option>
                                  );
                                }
                              })
                            : val === "paper"
                            ? paperList.map((field, k) => {
                                if (field.program === answerData.program) {
                                  return (
                                    <option key={k} value={field.id}>
                                      {field.name}
                                    </option>
                                  );
                                }
                              })
                            : val === "batch"
                            ? batchList.map((field, k) => {
                                return (
                                  <option key={k} value={field.id}>
                                    {field.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Input>
                        <FormFeedback>{err[val]}</FormFeedback>
                      </FormGroup>
                    );
                  })
                : ""}

              <hr />

              {dataField?.extra_fields?.length > 0 &&
                dataField.extra_fields.map((field) => {
                  if (field.status) {
                    return (
                      <>
                        {field.type === "textarea" ? (
                          <FormGroup>
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <Input
                              type="textarea"
                              rows="3"
                              name={field.field_uuid}
                              id={field.field_uuid}
                              min={field?.minimum}
                              max={field?.maximum}
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              value={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : ""
                              }
                              // required={field?.is_required || false}
                              disabled={
                                data_id !== undefined && data_id !== ""
                                  ? field.editable
                                  : false
                              }
                              invalid={!!err[field.field_uuid]}
                            ></Input>
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : field.type === "checkbox" ? (
                          <FormGroup>
                            <Input
                              type="checkbox"
                              name={field.field_uuid}
                              id={field.name_id}
                              invalid={!!err[field.name_id]}
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              checked={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : false
                              }
                              disabled={
                                data_id !== undefined && data_id !== ""
                                  ? field.editable
                                  : false
                              }
                              // invalid={!!field.field_uuid}
                            />
                            {"  "}
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : field.type === "select_box" ||
                          field.type === "select box" ? (
                          <FormGroup>
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <Input
                              name={field.field_uuid}
                              type="select"
                              id={field.field_uuid}
                              invalid={!!err[field.field_uuid]}
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              value={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : ""
                              }
                              // required={field?.is_required || false}
                              disabled={
                                data_id !== undefined && data_id !== ""
                                  ? field.editable
                                  : false
                              }
                            >
                              <option value="">{field.label}</option>
                              {field?.options.dropdown.length > 0 &&
                                field.options.dropdown.map((option, index) => (
                                  <option key={index} value={option.value}>
                                    {option.value}
                                  </option>
                                ))}
                            </Input>
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : field.type === "date" ? (
                          <FormGroup>
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <Input
                              type="Date"
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              name={field.field_uuid}
                              id={field.field_uuid}
                              invalid={!!err[field.field_uuid]}
                              value={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : ""
                              }
                              // required={field?.is_required || false}
                              disabled={
                                data_id !== undefined && data_id !== ""
                                  ? field.editable
                                  : false
                              }
                            />
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : field.type === "text" ? (
                          <FormGroup>
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <Input
                              type="text"
                              name={field.field_uuid}
                              id={field.field_uuidname_id}
                              min={field?.minimum}
                              max={field?.maximum}
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              value={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : ""
                              }
                              // required={field?.is_required || false}
                              invalid={!!err[field.field_uuid]}
                            />
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : field.type === "number" ? (
                          <FormGroup>
                            <Label className="optional_fields-label">
                              {field.label}
                            </Label>
                            <Input
                              type="number"
                              name={field.field_uuid}
                              id={field.field_uuid}
                              min={field?.minimum}
                              max={field?.maximum}
                              onChange={(e) => handleJdocAnswerChange(e, field)}
                              value={
                                answerDataJoc[field?.field_uuid]
                                  ? answerDataJoc[field?.field_uuid][1]
                                  : ""
                              }
                              // required={field?.is_required || false}
                              disabled={
                                data_id !== undefined && data_id !== ""
                                  ? field.editable
                                  : false
                              }
                              invalid={!!err[field.field_uuid]}
                            />
                            <FormFeedback>{err[field.field_uuid]}</FormFeedback>
                          </FormGroup>
                        ) : (
                          <FormGroup>
                            <Row>
                              <Col
                                xs={
                                  answerDataJoc[field?.field_uuid] &&
                                  answerDataJoc[field?.field_uuid][1]
                                    ? 11
                                    : 12
                                }
                              >
                                <Label className="optional_fields-label">
                                  {field.label}
                                </Label>
                                <Input
                                  type="file"
                                  name={field.field_uuid}
                                  id={field.field_uuid}
                                  onChange={(event) =>
                                    handleFiles(event, field)
                                  }
                                  accept="image/*,.pdf"
                                  disabled={
                                    data_id !== undefined && data_id !== ""
                                      ? field.editable
                                      : false
                                  }
                                  invalid={!!err[field.field_uuid]}
                                />
                                <FormFeedback>
                                  {err[field.field_uuid]}
                                </FormFeedback>
                              </Col>
                              {answerDataJoc[field?.field_uuid] &&
                                answerDataJoc[field?.field_uuid][1] && (
                                  <Col
                                    xs={1}
                                    className="d-flex justify-content-center align-items-center"
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary mt-4"
                                      onClick={() => viewFile(field)}
                                    >
                                      View
                                    </button>
                                  </Col>
                                )}
                            </Row>
                          </FormGroup>
                        )}
                      </>
                    );
                  }
                })}

              <hr />

              {dataField?.static_fields?.length > 0
                ? dataField?.static_fields?.map((field, k) => {
                    return (
                      <FormGroup key={k}>
                        <Label className="optional_fields-label">
                          {field?.name}{" "}
                          {field.type === "date"
                            ? " of activity (if no date available choose any date of the year of activity)"
                            : field.type === "file"
                            ? "(If any files available)"
                            : field.name === "Additional Links"
                            ? "(If any resource URL available)"
                            : ""}{" "}
                        </Label>
                        {field.type === "file" ? (
                          <Input
                            type={field.type}
                            name="file"
                            onChange={(event) => {
                              setFiles({
                                ...files,
                                [event.target.name]: event.target.files[0],
                              });
                            }}
                          />
                        ) : (
                          <>
                            <Input
                              type={field.type}
                              name={`${
                                field.type === "file"
                                  ? "file"
                                  : field?.name === "Additional Links"
                                  ? "url"
                                  : field?.name
                              }`}
                              onChange={handleAnswerChange}
                              value={
                                field?.name === "Additional Links"
                                  ? answerData["url"]
                                  : answerData["date"]
                              }
                              invalid={
                                field.type === "date" ? !!err?.date : false
                              }
                            />
                            {field.type === "date" ? (
                              <FormFeedback>{err?.date}</FormFeedback>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </FormGroup>
                    );
                  })
                : ""}
            </CardBody>
            <CardFooter className="d-flex justify-content-end">
              <Button
                size="sm"
                disabled={submitLoader}
                outline
                onClick={() => navigate("/all-criterions")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitLoader}
                className="ms-2"
                color="success"
              >
                {submitLoader ? "Submitting.." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Col>
      <Col xs="1" sm="1"></Col>
    </Row>
  );
}

export default AddCriterionDetails;
