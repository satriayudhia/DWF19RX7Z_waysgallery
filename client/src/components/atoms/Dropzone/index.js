import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: "image/jpeg, image/png",
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  //   const fileRejectionItems = fileRejections.map(({ file, errors }) => (
  //     <li key={file.path}>
  //       {file.path} - {file.size} bytes
  //       <ul>
  //         {errors.map((e) => (
  //           <li key={e.code}>{e.message}</li>
  //         ))}
  //       </ul>
  //     </li>
  //   ));

  return (
    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Upload Best Your Art</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        {/* <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul> */}
      </aside>
    </section>
  );
}

export default Dropzone;
