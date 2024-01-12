import React from "react";

function PageTitle({ title }) {
  return (
    <div className="pagetitle">
      <h1>{title}</h1>
      {/* <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li className="breadcrumb-item active">Dashboard</li>
                </ol>
            </nav> */}
    </div>
  );
}

export default PageTitle;
