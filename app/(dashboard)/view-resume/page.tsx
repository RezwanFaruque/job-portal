import LeftSideBar from "@/components/features/LeftSideBar";
import ViewResumeComponent from "@/components/features/ViewResumeComponent";

export default function ViewResumePage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/view-resume" />
          </div>
          <div className="col-md-9">
            <ViewResumeComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
