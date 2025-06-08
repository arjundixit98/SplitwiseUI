import { useEffect, useState } from "react";


const CameraCard = ()=> {
  const [billImageUrl, setBillImageUrl] = useState(null);
  const [billImageFile, setBillImageFile] = useState(null);

  const fetchAPIData = async () => {
    try {
       const response = await fetch('http://localhost:8000/');
       const data = await response.json();
       console.log(data)
    } catch (error) {
      console.log('Error occured', error)
    }
  }

  const sendData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/llm/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text : 'what is 2 + 2 ?'})
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(data.response.output[0].content[0].text);
  

    } catch (error) {
      console.log('error while sending data', error)
    }
  }


  const handleImageChange = (event) =>{
    if(event.target.files && event.target.files[0])
    {
      setBillImageUrl(URL.createObjectURL(event.target.files[0]));
      const file = event.target.files[0];
      setBillImageFile(file);
    }
    //fetchAPIData();
  }

  //function to upload the image to backend as formData
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', billImageFile);

    const response = await fetch('http://localhost:8000/api/llm/',
      {
        'method' : 'POST',
        'body'  : formData,
      });
    
    const data = await response.json();
    console.log(data.response); 
  
  };

    

  // useEffect(()=>{
  //   sendData();
  // });

  //pass the Image to the LLM and ask LLM to give back the structured bill data
  
  return (
    <div className="p-2">
        <p> Use your camera to capture the Bill</p>
        <input type='file' accept="image/*" capture='environment' placeholder="Upload your bill!" onChange={handleImageChange}/>
        {billImageUrl && 
        (  
            <div>
                <img src={billImageUrl} />
            
            <button onClick={handleUpload}>Upload</button>
            </div>
        )}

    </div>
  )
}

export default CameraCard;