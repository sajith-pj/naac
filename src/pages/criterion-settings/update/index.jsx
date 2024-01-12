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
} from "reactstrap";
import axios from "../../../axios";
import Loader from "../../../components/loader";
import "../criterion.scss";
import { isRequired } from "../../../utils/validators";
import ClubModal from "../clubModal";
import NewFiledModal from "../ExtraFields";
import { toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditNormalFieldModal from "./editNormalFieldModal";

function UpdateCriterion() {
  const { id } = useParams();
  const navigate = useNavigate();
  let userDetails = useOutletContext();

  const [loader, setLoader] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    weightage: "",
    desc: "",
    keywords: "",
    status: true,
    is_active: true,
    is_enabled: true,
    admin_enabled: false,
    iqac_enabled: false,
    hod_enabled: false,
    staff_enabled: false,
    club_enabled: false,
    extra_fields: [],
    user: userDetails?.id,
  });

  const [optFields, setOptFields] = useState({
    department: false,
    program: false,
    paper: false,
    batch: false,
  });
  const [err, setErr] = useState({
    version: "",
    main_id: "",
    sub_id: "",
    final_id: "",
    main_title: "",
    sub_title: "",
    question: "",
  });
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [extraFields, setExtraFields] = useState([]);
  const [showUpdateNormalFieldModal, setShhowUpdateNormalFieldModal] =
    useState(false);
  const [selectedNormalField, setSelectedNormalField] = useState({});

  useEffect(() => {
    getEnalbledClubs();
    getSingleCriterion();
  }, []);

  const getSingleCriterion = () => {
    axios
      .get(`/criterion/details/list/${id}`)
      .then((response) => {
        let data = response?.data?.data;
        setSelectedClubs([...data?.clubs]);
        let optFields = data?.optional_fields || [];
        let extraFields = data?.extra_fields || [];
        extraFields = extraFields.filter((val) => val.type !== "file");
        setExtraFields(extraFields);
        let optObj = {};
        optFields.forEach((val) => {
          let name = val?.name;
          optObj[name] = val.status;
        });
        setOptFields({ ...optObj });

        setCriterionDetails({
          ...data,
          final_id: data?.criterion,
          extra_fields: [],
          is_active: true,
          main_id: data?.criterion.split(".")[0],
          sub_id: `${data?.criterion.split(".")[0]}.${
            data?.criterion.split(".")[1]
          }`,
        });
      })
      .finally(() => setLoader(false));
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
        "staff_enabled",
        "hod_enabled",
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
    const { name, checked } = e.target;
    setOptFields({ ...optFields, [name]: checked });
  };

  const submitCriterion = () => {
    let err = {
      main_id: isRequired(criterionDetails.main_id),
      sub_id: isRequired(criterionDetails.sub_id),
      final_id: isRequired(criterionDetails.final_id),
      main_title: isRequired(criterionDetails.main_title),
      sub_title: isRequired(criterionDetails.sub_title),
      question: isRequired(criterionDetails.question),
    };
    if (Object.values(err).some((val) => val !== "")) {
      setErr(err);
      window.scrollTo(0, 0);
      return;
    }
    setSubmitting(true);

    let data = {
      ...criterionDetails,
      clubs: selectedClubs,
    };
    let arrExtra = [...extraFields];
    arrExtra.forEach((val) => {
      val.isFromEdit = undefined;
    });
    data.extra_fields = [...arrExtra];
    if (id) {
      axios
        .put("/criterion/details/list/" + id, data)
        .then((res) => {
          toast.success("Criterion updated successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/criterion-settings");
          }, 1500);
        })
        .catch((err) => {
          let msg =
            err?.response?.data?.message?.criterion?.[0] ||
            "Oops, Something went wrong!!";
          toast.error(msg, {
            position: "top-right",
            autoClose: 2000,
          });
          setSubmitting(false);
        });
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

  const openNewFieldModal = () => {
    setShowFieldModal(true);
  };

  const recieveNewField = (data) => {
    let arr = [...extraFields, data];
    setExtraFields(arr);
  };

  const deleteField = (name, id) => {
    // if (["file2", "file3", "file4", "file5"].includes(name)) {
    //   let arr = [...extraFileFields];
    //   setExtraFileFields(arr.filter((val) => val.name_id !== id));
    // } else {
    //   let arr = [...extraFields];
    //   setextraFields(arr.filter((val) => val.name_id !== id));
    // }
  };

  const editNormalField = (val) => {
    setSelectedNormalField(val);
    setShhowUpdateNormalFieldModal(true);
  };

  const closeUpdateNormalFieldModal = () => {
    setShhowUpdateNormalFieldModal(false);
    setSelectedNormalField({});
  };

  const updateNormalField = (data) => {
    let arr = [...extraFields];
    let i = arr.findIndex((val) => val.name_id === data.name_id);
    if (i !== -1) {
      arr[i] = data;
      setExtraFields(arr);
      toast.success("Field details changed", {
        position: "top-right",
        autoClose: 1000,
      });
      closeUpdateNormalFieldModal();
    }
  };

  if (loader) return <Loader title={"Criterion Settings"} />;
  return (
    <Row>
      <div className="pagetitle">
        <h1>Update Criterion</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Admin Tools</li>
            <li className="breadcrumb-item">
              <Link to="/criterion-settings">Criterions</Link>
            </li>
            <li className="breadcrumb-item active">Update Criterion</li>
          </ol>
        </nav>
      </div>

      <Col xs="12">
        <Card>
          <CardHeader>Update Criterion</CardHeader>
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
                  {["2023"].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{err?.main_id}</FormFeedback>
              </Col>
              <Col xs="12" sm="3" className="mt-2">
                <Label>Major</Label>
                <Input
                  type="text"
                  name="main_id"
                  value={criterionDetails?.main_id}
                  disabled
                />
              </Col>

              <Col xs="12" sm="3" className="mt-2">
                <Label>Sub</Label>
                <Input
                  type="text"
                  name="sub_id"
                  value={criterionDetails?.sub_id}
                  disabled
                />
              </Col>

              <Col xs="12" sm="3" className="mt-2">
                <Label>Final</Label>
                <Input
                  type="text"
                  name="final_id"
                  value={criterionDetails?.final_id}
                  disabled
                />
              </Col>

              <Col xs="12" sm="3" className="mt-2">
                <Label style={{ visibility: "hidden" }}>Final</Label>
                <Input
                  type="text"
                  disabled
                  name="major"
                  value={`C ${criterionDetails?.final_id}`}
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
                <Label>Weightage</Label>
                <Input
                  type="number"
                  name="weightage"
                  value={criterionDetails?.weightage}
                  onChange={handleChange}
                />
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
                  checked={criterionDetails.status}
                  onChange={handleChange}
                />
                {"  "}
                <Label className="">
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
                      checked={optFields.department}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label className="">Department</Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="program"
                      checked={optFields.program}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label className="">Program</Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="paper"
                      checked={optFields.paper}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label className="">Paper</Label>
                  </Col>
                  <Col xs="12" sm="3" className="mt-2">
                    <Input
                      type="checkbox"
                      name="batch"
                      checked={optFields.batch}
                      onChange={handleChangeOptional}
                    />
                    {"  "}
                    <Label className="">Batch</Label>
                  </Col>
                </Row>
              </div>

              <Col xs="12" sm="4" className="mt-2">
                <button
                  className="crt-btn"
                  onClick={() => setShowClubModal(true)}
                >
                  + Enabled Clubs
                </button>
              </Col>
              <Col xs="12" sm="4" className="mt-2">
                <button
                  className="crt-btn"
                  onClick={() => {
                    openNewFieldModal("new");
                  }}
                >
                  + Add New Field
                </button>
              </Col>
              {[...extraFields].length > 0 && (
                <Col xs="12" className="mt-2">
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Hint</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...extraFields].map((val, ky) => {
                        return (
                          <tr key={ky}>
                            <td>
                              {val.file2 ||
                                val.file3 ||
                                val.file4 ||
                                val.file5 ||
                                val.name}
                            </td>
                            <td>{val?.type || "-"}</td>
                            <td>{val?.hint || "-"}</td>
                            <td>{val?.minimum || "-"}</td>
                            <td>{val?.maximum || "-"}</td>
                            <td>
                              {val?.isFromEdit ? (
                                ""
                              ) : (
                                <>
                                  <EditIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      editNormalField(val);
                                    }}
                                  />
                                </>
                              )}

                              {val?.isFromEdit && (
                                <DeleteIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    deleteField(val.name, val.name_id);
                                  }}
                                />
                              )}
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
              {submitting ? "updating.." : "Update"}
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

      <NewFiledModal
        showFieldModal={showFieldModal}
        setShowFieldModal={setShowFieldModal}
        recieveNewField={recieveNewField}
        isFromEdit={true}
        editData={selectedNormalField}
      />

      {/* <EditNormalFieldModal
        showUpdateNormalFieldModal={showUpdateNormalFieldModal}
        closeUpdateNormalFieldModal={closeUpdateNormalFieldModal}
        selectedField={selectedNormalField}
        updateNormalField={updateNormalField}
      /> */}
    </Row>
  );
}

export default UpdateCriterion;
