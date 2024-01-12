import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Label,
  CardFooter,
  Button,
  FormFeedback,
  Table,
  FormGroup,
} from "reactstrap";
import axios from "../../axios";
import "./criterion.scss";
import { isRequired } from "../../utils/validators";
import ClubModal from "./clubModal";
import { toast } from "react-toastify";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExtraFields from "./ExtraFields";

function AddCriterion() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  let userDetails = useOutletContext();

  const [submitting, setSubmitting] = useState(false);
  const [vsersionList, setVersionList] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [criterionDetails, setCriterionDetails] = useState({
    version: "",
    criterion: "",
    criterion_id: "",
    main_id: "",
    sub_id: "",
    final_id: "",
    main_title: "",
    sub_title: "",
    question: "",
    desc: "",
    keywords: "",
    weightage: "",
    status: true,
    is_active: true,
    admin_enabled: false,
    iqac_enabled: false,
    hod_enabled: false,
    staff_enabled: false,
    club_enabled: false,
    extra_fields: [],
    created_by: userDetails?.id,
  });
  const [major, setMajor] = useState([]);
  const [sub, setSub] = useState([]);
  const [final, setFinal] = useState([]);
  const [fieldConfig, setFieldConfig] = useState({
    optional_fields: [],
  });
  const [err, setErr] = useState({
    main_id: "",
    sub_id: "",
    final_id: "",
    main_title: "",
    sub_title: "",
    question: "",
    weightage: "",
    version: "",
  });
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedData, setSelectedData] = useState({
    isEdit: false,
    selectedData: {},
  });
  const [extraFields, setExtraFields] = useState([]);

  useEffect(() => {
    getEnalbledClubs();
    populateMajorData();
    getVersionList();
    if (id && id !== "") {
      getCriterion();
    }
  }, []);

  useEffect(() => {
    if (criterionDetails?.main_id) {
      let arr = [];
      for (let i = 1; i <= 20; i++) {
        let obj = {};
        obj.value = `${criterionDetails?.main_id}.${i}`;
        obj.id = i;
        arr.push(obj);
      }
      setSub(arr);
    } else {
      setCriterionDetails({ ...criterionDetails, main_id: "" });
    }
  }, [criterionDetails?.main_id]);

  useEffect(() => {
    if (criterionDetails?.sub_id && criterionDetails?.main_id) {
      let arr = [];
      for (let i = 1; i <= 50; i++) {
        let obj = {};
        obj.value = `${criterionDetails?.main_id}.${criterionDetails?.sub_id}.${i}`;
        obj.id = i;
        arr.push(obj);
      }
      setFinal(arr);
    }
  }, [criterionDetails?.sub_id, criterionDetails?.main_id]);

  const getVersionList = () => {
    axios.get("/adminapp/version-list").then((response) => {
      setVersionList(response.data.data);
    });
  };
  const populateMajorData = () => {
    let arr = [];
    for (let i = 1; i <= 10; i++) {
      let obj = {};
      obj.value = i;
      obj.id = i;
      arr.push(obj);
    }
    setMajor(arr);
  };

  const getBody = (keysArray, object) => {
    let returnObj = {};
    keysArray.forEach((key) => {
      returnObj[key] = object[key];
    });
    return returnObj;
  };

  const getCriterion = () => {
    axios.get(`/criterion/details/list/${id}`).then((response) => {
      let data = response?.data?.data;
      setSelectedClubs([...data?.clubs]);
      let extraFields = data?.extra_fields || [];
      setExtraFields(extraFields);
      setFieldConfig({ ...fieldConfig, ...data?.field_config });
      setCriterionDetails({
        ...data,
        extra_fields: [],
        is_active: true,
        main_id: data?.criterion.split(".")[0],
        sub_id: data?.criterion.split(".")[1],
        final_id: data?.criterion.split(".")[2],
        field_config: {
          optional_fields: [],
        },
      });
    });
    // .finally(() => setLoader(false));
  };

  const getEnalbledClubs = () => {
    axios.get("/programs/clubs/list").then((res) => {
      setClubs(res?.data?.data || []);
    });
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (
      [
        "status",
        "club_enabled",
        "hod_enabled",
        "staff_enabled",
        "iqac_enabled",
        "admin_enabled",
      ].includes(name)
    ) {
      setCriterionDetails({ ...criterionDetails, [name]: checked });
    } else {
      setCriterionDetails({ ...criterionDetails, [name]: value });
      setErr({ ...err, [name]: "" });
    }
  };

  const handleChangeOptional = (e) => {
    const { name } = e.target;
    let selectedOptionalFields = [];
    if (getOptFieldsValue(name)) {
      selectedOptionalFields = fieldConfig?.optional_fields.filter(
        (field) => field !== name
      );
    } else {
      selectedOptionalFields = fieldConfig?.optional_fields;
      selectedOptionalFields.push(name);
    }
    setFieldConfig({
      ...fieldConfig,
      optional_fields: selectedOptionalFields,
    });
  };

  const postExtraFields = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/criterion/get-extra-fields", data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const updateExtraFields = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`/criterion/get-extra-fields/${data.id}`, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const createCriterion = (data) => {
    axios
      .post("/criterion/details/list", data)
      .then((res) => {
        let uuid = res?.data?.data?.criterion_uuid;
        let criterionId = res?.data?.data?.criterion_id;
        let version = res?.data?.data?.version;
        Promise.all([
          ...extraFields.map((field) => {
            let data = {};
            if (
              field.type === "text" ||
              field.type === "number" ||
              field.type === "textarea"
            ) {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "options",
                  "version",
                ],
                field
              );
            } else if (field.type === "file") {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "version",
                ],
                field
              );
            } else if (field.type === "select_box") {
              if (field.selectBoxType === "api") {
                data = getBody(
                  [
                    "type",
                    "order",
                    "is_editable",
                    "status",
                    "is_required",
                    "details",
                    "label",
                    "details",
                    "version",
                    "selectBoxType",
                    "api",
                    "api_enabled",
                  ],
                  field
                );
              } else {
                data = getBody(
                  [
                    "type",
                    "order",
                    "is_editable",
                    "status",
                    "is_required",
                    "details",
                    "label",
                    "details",
                    "version",
                    "options",
                  ],
                  field
                );
              }
            } else if (field.type === "checkbox" || field.type === "date") {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "version",
                ],
                field
              );
            }
            return postExtraFields({
              ...data,
              criterion_uuid: uuid,
              criterion_id: criterionId,
              version,
            });
          }),
        ])
          .then((result) => {
            toast.success("Criterion added successfully", {
              position: "top-right",
              autoClose: 2000,
            });
            resetDatas();
          })
          .catch((error) => {
            toast.error(error.response.data.message, {
              position: "top-right",
              autoClose: 2000,
            });
          });
      })
      .catch((err) => {
        let msg =
          err?.response?.data?.message?.criterion?.[0] ||
          "Oops, Something went wrong!!";
        toast.error(msg, {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .finally(() => setSubmitting(false));
  };

  const updateCriterion = (data) => {
    axios
      .put(`/criterion/details/list/${id}`, data)
      .then((res) => {
        let uuid = res?.data?.data?.criterion_uuid;
        let criterionId = res?.data?.data?.criterion_id;
        let version = res?.data?.data?.version;
        Promise.all(
          extraFields.map((field) => {
            let data = {};
            if (
              field.type === "text" ||
              field.type === "number" ||
              field.type === "textarea"
            ) {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "options",
                  "version",
                ],
                field
              );
            } else if (field.type === "file") {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "version",
                ],
                field
              );
            } else if (field.type === "select_box") {
              if (field.selectBoxType === "api") {
                data = getBody(
                  [
                    "type",
                    "order",
                    "is_editable",
                    "status",
                    "is_required",
                    "details",
                    "label",
                    "details",
                    "version",
                    "selectBoxType",
                    "api",
                    "api_enabled",
                  ],
                  field
                );
              } else {
                data = getBody(
                  [
                    "type",
                    "order",
                    "is_editable",
                    "status",
                    "is_required",
                    "details",
                    "label",
                    "details",
                    "version",
                    "options",
                  ],
                  field
                );
              }
            } else if (field.type === "checkbox" || field.type === "date") {
              data = getBody(
                [
                  "type",
                  "order",
                  "is_editable",
                  "is_required",
                  "label",
                  "details",
                  "status",
                  "version",
                ],
                field
              );
            }
            if (field?.field_uuid) {
              return updateExtraFields({
                ...data,
                criterion_uuid: uuid,
                criterion_id: criterionId,
                version,
                id: field?.field_uuid,
                field_uuid: field?.field_uuid,
              });
            } else
              return postExtraFields({
                ...data,
                criterion_uuid: uuid,
                criterion_id: criterionId,
                version,
                // id: res?.data?.data?.id,
              });
          })
        )
          .then((result) => {
            toast.success("Criterion Updated successfully", {
              position: "top-right",
              autoClose: 2000,
            });
            resetDatas();
          })
          .catch((error) => {
            toast.error("Something  went wrong", {
              position: "top-right",
              autoClose: 2000,
            });
          });
      })
      .catch((err) => {
        let msg =
          err?.response?.data?.message?.criterion?.[0] ||
          "Oops, Something went wrong!!";
        toast.error(msg, {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .finally(() => setSubmitting(false));
  };

  const submitCriterion = () => {
    let err = {
      main_id: isRequired(criterionDetails.main_id),
      sub_id: isRequired(criterionDetails.sub_id),
      final_id: isRequired(criterionDetails.final_id),
      main_title: isRequired(criterionDetails.main_title),
      sub_title: isRequired(criterionDetails.sub_title),
      question: isRequired(criterionDetails.question),
      weightage: isRequired(criterionDetails.weightage),
      version: isRequired(criterionDetails.version),
    };
    if (Object.values(err).some((val) => val !== "")) {
      setErr(err);
      window.scrollTo(0, 0);
      return;
    }
    setSubmitting(true);
    let c_id = `c${criterionDetails?.main_id}_${criterionDetails?.sub_id}_${criterionDetails?.final_id}`;
    let crit = `${criterionDetails?.main_id}.${criterionDetails?.sub_id}.${criterionDetails?.final_id}`;
    let data = {
      ...criterionDetails,
      field_config: fieldConfig,
      criterion_id: c_id,
      criterion: crit,
      clubs: selectedClubs,
    };

    // data.extra_fields = [...extraFields];
    if (id) {
      updateCriterion(data);
    } else {
      createCriterion(data);
    }
  };

  const handleChangeClub = (id) => {
    let arr = [...selectedClubs];
    if (arr.includes(id)) {
      arr = arr.filter((val) => val !== id);
      setSelectedClubs(arr);
    } else {
      arr.push(id);
      setSelectedClubs(arr);
    }
  };

  const resetDatas = () => {
    setSelectedClubs([]);
    setFieldConfig({});
    setCriterionDetails({
      version: "",
      criterion: "",
      criterion_id: "",
      main_id: "",
      sub_id: "",
      final_id: "",
      main_title: "",
      sub_title: "",
      question: "",
      desc: "",
      keywords: "",
      weightage: "",
      status: true,
      is_active: true,
      admin_enabled: false,
      iqac_enabled: false,
      hod_enabled: false,
      staff_enabled: false,
      club_enabled: false,
      enabledClubs: [],
      extra_fields: [],
      user: userDetails?.id,
    });
    setSub([]);
    setFinal([]);
    setExtraFields([]);
    navigate("/criterion-settings");
  };

  const openNewFieldModal = () => {
    setShowFieldModal(true);
  };

  const editExtraField = (val) => {
    setShowFieldModal(true);
    setSelectedData({ isEdit: true, selectedData: val });
  };

  const recieveNewField = (data) => {
    let arr = extraFields;
    let filedIndex = extraFields.findIndex((field, index) => index === data.id);
    if (filedIndex === -1) {
      let arr = [...extraFields, data];
      setExtraFields(arr);
    } else {
      arr[filedIndex] = data;
      setExtraFields(arr);
    }
  };

  const deleteField = (name, id) => {
    // if (
    //   [
    //     "file1",
    //     "file2",
    //     "file3",
    //     "file4",
    //     "file5",
    //     "file6",
    //     "file7",
    //     "file8",
    //   ].includes(name)
    // ) {
    //   let arr = [...extraFileFields];
    //   setExtraFileFields(arr.filter((val) => val.name_id !== id));
    // } else {
    //   let arr = [...extraFields];
    //   setextraFields(arr.filter((val) => val.name_id !== id));
    // }
  };

  const getOptFieldsValue = (option) => {
    if(fieldConfig?.optional_fields){
      let isExist = fieldConfig?.optional_fields.find((opt) => opt === option);
      if (isExist) {
        return true;
      }
      return false;
    }
  };

  return (
    <Row>
      <div className="pagetitle">
        {id ? <h1>Update Criterion</h1> : <h1>Add Criterion</h1>}
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Admin Tools</li>
            <li className="breadcrumb-item">
              <Link to="/criterion-settings">Criterions</Link>
            </li>
            <li className="breadcrumb-item active">
              {id ? "Update Criterion" : " Add Criterion"}
            </li>
          </ol>
        </nav>
      </div>

      <Col xs="12">
        <Card>
          <CardHeader>
            {id ? "Update Criterion" : "Add New Criterion"}
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12" className="mt-2">
                <Label>Version</Label>
                <Input
                  onChange={handleChange}
                  invalid={!!err?.version}
                  type="select"
                  name="version"
                  value={criterionDetails?.version}
                >
                  <option value={""}>Select Version</option>
                  {vsersionList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{err?.version}</FormFeedback>
              </Col>
              <Col xs="12" sm="3" className="mt-2">
                <Label>Major</Label>
                <Input
                  onChange={handleChange}
                  invalid={!!err?.main_id}
                  type="select"
                  name="main_id"
                  value={criterionDetails?.main_id}
                >
                  <option value={""}>Select</option>
                  {major.length > 0
                    ? major.map((val, k) => {
                        return (
                          <option key={k} value={val.id}>
                            {val.value}
                          </option>
                        );
                      })
                    : ""}
                </Input>
                <FormFeedback>{err?.main_id}</FormFeedback>
              </Col>
              <Col xs="12" sm="3" className="mt-2">
                <Label>Sub</Label>
                <Input
                  type="select"
                  invalid={!!err?.sub_id}
                  onChange={handleChange}
                  name="sub_id"
                  value={criterionDetails?.sub_id}
                >
                  <option value={""}>Select</option>
                  {sub.length > 0
                    ? sub.map((val, k) => {
                        return (
                          <option key={k} value={val.id}>
                            {val.value}
                          </option>
                        );
                      })
                    : ""}
                </Input>
                <FormFeedback>{err?.sub_id}</FormFeedback>
              </Col>
              <Col xs="12" sm="3" className="mt-2">
                <Label>Final</Label>
                <Input
                  type="select"
                  invalid={!!err?.final_id}
                  name="final_id"
                  onChange={handleChange}
                  value={criterionDetails?.final_id}
                >
                  <option value={""}>Select</option>
                  {final.length > 0
                    ? final.map((val, k) => {
                        return (
                          <option key={k} value={val.id}>
                            {val.value}
                          </option>
                        );
                      })
                    : ""}
                </Input>
                <FormFeedback>{err?.final_id}</FormFeedback>
              </Col>

              <Col xs="12" sm="3" className="mt-2">
                <Label style={{ visibility: "hidden" }}>Final</Label>
                <Input
                  type="text"
                  disabled
                  name="major"
                  value={`C  ${criterionDetails?.main_id}.${criterionDetails?.sub_id}.${criterionDetails?.final_id}`}
                />
              </Col>

              <Col xs="12" sm="6" className="mt-2">
                <Label>Main title</Label>
                <Input
                  type="text"
                  invalid={!!err?.main_title}
                  name="main_title"
                  value={criterionDetails?.main_title}
                  onChange={handleChange}
                />
                <FormFeedback>{err?.main_title}</FormFeedback>
              </Col>

              <Col xs="12" sm="6" className="mt-2">
                <Label>Sub title</Label>
                <Input
                  type="text"
                  invalid={!!err?.sub_title}
                  name="sub_title"
                  value={criterionDetails?.sub_title}
                  onChange={handleChange}
                />
                <FormFeedback>{err?.sub_title}</FormFeedback>
              </Col>
              <Col xs="12" sm="6" className="mt-2">
                <Label>Question</Label>
                <Input
                  type="text"
                  invalid={!!err?.question}
                  name="question"
                  value={criterionDetails?.question}
                  onChange={handleChange}
                />
                <FormFeedback>{err?.question}</FormFeedback>
              </Col>

              <Col xs="12" sm="6" className="mt-2">
                <Label>Key word for search</Label>
                <Input
                  type="text"
                  name="keywords"
                  value={criterionDetails?.keywords}
                  onChange={handleChange}
                />
              </Col>

              <Col xs="12" className="mt-2">
                <FormGroup>
                  <Label>Weightage</Label>
                  <Input
                    type="number"
                    name="weightage"
                    value={criterionDetails?.weightage}
                    onChange={handleChange}
                    invalid={!!err?.weightage}
                  />
                  <FormFeedback>{err?.weightage}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="12" className="mt-2">
                <Label>Description</Label>
                <Input
                  type="textarea"
                  rows="3"
                  name="desc"
                  value={criterionDetails?.desc}
                  onChange={handleChange}
                />
              </Col>

              <Col xs="12" className="mt-2">
                <Input
                  type="checkbox"
                  name="status"
                  id="status"
                  checked={criterionDetails.status}
                  onChange={handleChange}
                />
                {"  "}
                <Label htmlFor="status" className="ms-2">
                  Status (check to enable this criterion status)
                </Label>
              </Col>

              <div className="enable-for mt-2 mb-2">
                <Row>
                  <Col xs="12">
                    <span className="enable-for-head">Enable for</span>
                  </Col>
                  <hr />
                  <Col xs="12" sm="3" md="2" className="mt-2">
                    <Input
                      type="checkbox"
                      name="admin_enabled"
                      id="admin_enabled"
                      checked={criterionDetails.admin_enabled}
                      onChange={handleChange}
                    />
                    {"  "}
                    <Label htmlFor="admin_enabled" className="ms-2">
                      NAAC
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" md="2" className="mt-2">
                    <Input
                      type="checkbox"
                      name="iqac_enabled"
                      id="iqac_enabled"
                      checked={criterionDetails.iqac_enabled}
                      onChange={handleChange}
                    />
                    {"  "}
                    <Label htmlFor="iqac_enabled" className="ms-2">
                      IQAC
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" md="2" className="mt-2">
                    <Input
                      type="checkbox"
                      name="hod_enabled"
                      id="hod_enabled"
                      checked={criterionDetails.hod_enabled}
                      onChange={handleChange}
                    />
                    {"  "}
                    <Label htmlFor="hod_enabled" className="ms-2">
                      DEPT
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" md="2" className="mt-2">
                    <Input
                      type="checkbox"
                      name="staff_enabled"
                      id="staff_enabled"
                      checked={criterionDetails.staff_enabled}
                      onChange={handleChange}
                    />
                    {"  "}
                    <Label htmlFor="staff_enabled" className="ms-2">
                      STAFF
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" md="2" className="mt-2">
                    <Input
                      type="checkbox"
                      name="club_enabled"
                      id="club_enabled"
                      checked={criterionDetails.club_enabled}
                      onChange={handleChange}
                    />
                    {"  "}
                    <Label htmlFor="club_enabled" className="ms-2">
                      CLUBS
                    </Label>
                  </Col>
                </Row>
              </div>

              <div className="enable-for mt-2 mb-2">
                <Row>
                  <Col xs="12">
                    <span className="enable-for-head">Optional fields</span>
                  </Col>
                  <hr />
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="department"
                      id="department"
                      checked={getOptFieldsValue("department")}
                      onChange={handleChangeOptional}
                    />
                    <Label htmlFor="department" className="ms-2">
                      Department
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="program"
                      id="program"
                      checked={getOptFieldsValue("program")}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label htmlFor="program" className="ms-2">
                      Program
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="paper"
                      id="paper"
                      checked={getOptFieldsValue("paper")}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label htmlFor="paper" className="ms-2">
                      Paper
                    </Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="batch"
                      id="batch"
                      checked={getOptFieldsValue("batch")}
                      onChange={handleChangeOptional}
                    />
                    <Label htmlFor="batch" className="ms-2">
                      Batch
                    </Label>
                  </Col>
                </Row>
              </div>

              <Col xs="12" sm="4" className="mt-2">
                <button
                  className="crt-btn"
                  onClick={() => setShowClubModal(true)}
                >
                  +Enabled Clubs
                </button>
              </Col>
              <Col xs="12" sm="4" className="mt-2">
                <button
                  className="crt-btn "
                  onClick={() => {
                    openNewFieldModal("new");
                  }}
                >
                  +Add New Field
                </button>
              </Col>
              {[...extraFields].length > 0 && (
                <Col xs="12" className="mt-2">
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Details</th>
                        <th>Order</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...extraFields].map((val, ky) => {
                        return (
                          <tr key={ky}>
                            <td>
                              {val.file1 ||
                                val.file2 ||
                                val.file3 ||
                                val.file4 ||
                                val.file5 ||
                                val.file6 ||
                                val.file7 ||
                                val.file8 ||
                                val.label}
                            </td>
                            <td>{val?.type || "-"}</td>
                            <td>{val?.details || "-"}</td>
                            <td>{val?.order || "-"}</td>
                            <td>
                              {(val?.options &&
                                val?.options.length?.minimum_length) ||
                                "-"}
                            </td>
                            <td>
                              {(val?.options &&
                                val?.options.length?.maximum_length) ||
                                "-"}
                            </td>
                            <td>
                              <>
                                <EditIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    editExtraField({ ...val, id: ky });
                                  }}
                                />
                              </>

                              {/* <DeleteIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  deleteField(val.name, val.name_id);
                                }}
                              /> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              )}
            </Row>
          </CardBody>
          <CardFooter className="d-flex justify-content-end">
            <Button
              disabled={submitting}
              onClick={() => navigate("/criterion-settings")}
              outline
              size="sm"
              style={{ marginRight: "5px" }}
            >
              Cancel
            </Button>
            <Button
              disabled={submitting}
              color="success"
              onClick={submitCriterion}
              size="sm"
            >
              {id ? "Update" : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </Col>

      <ClubModal
        clubs={clubs}
        selectedClubs={selectedClubs}
        showClubModal={showClubModal}
        setShowClubModal={setShowClubModal}
        handleChangeClub={handleChangeClub}
      />

      <ExtraFields
        showFieldModal={showFieldModal}
        setShowFieldModal={setShowFieldModal}
        extraFields={extraFields}
        recieveNewField={recieveNewField}
        editData={selectedData.selectedData}
        isFromEdit={selectedData.isEdit}
        closeModal={() => {
          setSelectedData({});
          setShowFieldModal(false);
        }}
      />
    </Row>
  );
}

export default AddCriterion;
