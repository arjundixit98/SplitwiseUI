import { useState } from "react";


const CameraCard = ()=> {
  const [billImageUrl, setBillImageUrl] = useState(null);


  const handleImageChange = (event) =>{
    if(event.target.files && event.target.files[0])
    {
      setBillImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  //pass the Image to the LLM and ask LLM to give back the structured bill data
  
  return (
    <div className="p-2">
        <p> Use your camera to capture the Bill</p>
        <input type='file' accept="image/*" capture='environment' placeholder="Upload your bill!" onChange={handleImageChange}/>
        {billImageUrl && (<img src={billImageUrl} />)}
    </div>
  )
}

export default CameraCard;