import AppliedJobComponent from "@/components/features/AppliedJobComponent";
import LeftSideBar from "@/components/features/LeftSideBar";

export default function AppliedJobPage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/applied-job" />
          </div>
          <div className="col-md-9">
            <AppliedJobComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
