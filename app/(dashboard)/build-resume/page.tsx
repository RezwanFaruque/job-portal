import LeftSideBar from "@/components/features/LeftSideBar";
import BuildResumeComponent from "@/components/features/BuildResumeComponent";

export default function BuildResumePage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/build-resume" />
          </div>
          <div className="col-md-9">
            <BuildResumeComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
