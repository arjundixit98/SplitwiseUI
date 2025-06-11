import {useState, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import BillTable from "./BillTable";


const CameraCard = ()=> {
  const [billImageUrl, setBillImageUrl] = useState(null);
  const [billImageFile, setBillImageFile] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  
   //function to upload the image to backend as formData
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', billImageFile);

    // const response = await fetch('http://localhost:8000/api/llm/',
    //   {
    //     'method' : 'POST',
    //     'body'  : formData,
    //   });
    
    // const {output, status} = await response.json();
    // console.log(output);
    // console.log(status);
    const output = {'restaurant': 'MIYA KEBABS (Andheri West)', 'items': [{'name': 'Dynamic Tangdi', 'quantity': 1, 'unit_price': 245, 'total': 245}, {'name': 'Angara Chicken Shawarma Roomali', 'quantity': 2, 'unit_price': 220, 'total': 440}, {'name': 'Chicken Kashmiri Tikka', 'quantity': 1, 'unit_price': 460, 'total': 460}, {'name': 'Mutton Seekh Kebabs', 'quantity': 1, 'unit_price': 450, 'total': 450}], 'summary': {'subtotal': 1605, 'taxes': {'SGST': 40.13, 'CGST': 40.13}, 'round_off': -0.26, 'grand_total': 1685}};
    

    setBillDetails(output);
    //console.log(`status:${status}, output:${output[0].content[0].text}`)

  };

 
  const handleImageChange = (event) =>{
    if(event.target.files && event.target.files[0])
    {
      setBillImageUrl(URL.createObjectURL(event.target.files[0]));
      const file = event.target.files[0];
      setBillImageFile(file);
    }
    handleUpload();
  }

 
 
  return (
    <div className="flex flex-col items-center">
        <h1 className="text-xl bold font-bold mt-4"> Use your camera to capture the Bill</h1>
        <label  htmlFor="bill-upload"
            className="cursor-pointer flex items-center w-36 mt-4 gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
        >
              <CameraIcon className="w-5 h-5" />
                  Upload Bill
        </label>
        <input type='file' id='bill-upload' className='hidden' accept="image/*" capture='environment' placeholder="Upload your bill!" onChange={handleImageChange}/>
        {billImageUrl && 
        (  
            <div className="mt-4">
                <img src={billImageUrl} className="h-120 w-80 object-cover rounded"/>    
            </div>
        )}

        {billDetails && <BillTable billDetails={billDetails} setBillDetails={setBillDetails}/>}

        
    </div>
  )
}

export default CameraCard;