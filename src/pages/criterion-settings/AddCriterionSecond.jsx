import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";

const AddCriterionSecond = () => {
  const [enabledFor, setEnabledFor] = useState({
    admin_enabled: false,
    iqac_enabled: false,
    hod_enabled: false,
    staff_enabled: false,
  });

  const [optionalFields, setOptionalFields] = useState({
    department: false,
    program: false,
    paper: false,
    batch: false,
  });

  const [modal, setModal] = useState({
    clubModal: true,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setEnabledFor({ ...enabledFor, [name]: checked });
  };

  const handleOptionalFieldChange = (event) => {
    const { name, checked } = event.target;
    setOptionalFields({ ...optionalFields, [name]: checked });
  };
  return (
    <Row>
      <Col xs="12">
        <Card>
          <CardHeader>Add Criterion </CardHeader>
          <CardBody>
            <Row className="mt-5">
              <Col xs={12}>
                <Card>
                  <CardHeader>Enable for </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="3" md="2" className="mt-2">
                        <Input
                          type="checkbox"
                          name="admin_enabled"
                          id="admin_enabled"
                          checked={enabledFor.admin_enabled}
                          onChange={handleChange}
                        />
                        <Label htmlFor="admin_enabled" className="ms-2">
                          NAAC
                        </Label>
                      </Col>
                      <Col xs="12" sm="3" md="2" className="mt-2">
                        <Input
                          type="checkbox"
                          name="iqac_enabled"
                          id="iqac_enabled"
                          checked={enabledFor.iqac_enabled}
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
                          checked={enabledFor.hod_enabled}
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
                          checked={enabledFor.staff_enabled}
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
                          checked={enabledFor.club_enabled}
                          onChange={handleChange}
                        />
                        <Label htmlFor="club_enabled" className="ms-2">
                          CLUBS
                        </Label>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader>Optional Fields</CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="3" className="mt-2">
                        <Input
                          type="checkbox"
                          name="department"
                          id="department"
                          checked={optionalFields.department}
                          onChange={handleOptionalFieldChange}
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
                          checked={optionalFields.program}
                          onChange={handleOptionalFieldChange}
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
                          checked={optionalFields.paper}
                          onChange={handleOptionalFieldChange}
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
                          checked={optionalFields.batch}
                          onChange={handleOptionalFieldChange}
                        />
                        {"  "}
                        <Label htmlFor="batch" className="ms-2">
                          Batch
                        </Label>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader>Optional Fields</CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="4" className="mt-2">
                        <button
                          className="crt-btn"
                          onClick={() =>
                            setModal({ ...modal, clubModal: true })
                          }
                        >
                          +Enabled Clubs
                        </button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCriterionSecond;
