import UploadResumeComponent from "@/components/features/UploadResumeComponent";
import LeftSideBar from "@/components/features/LeftSideBar";

export default function UploadResumePage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/upload-resume" />
          </div>
          <div className="col-md-9">
            <UploadResumeComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
