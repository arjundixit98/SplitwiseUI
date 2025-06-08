import {useState, useEffect } from "react";
import { CameraIcon } from "lucide-react";


const CameraCard = ()=> {
  const [billImageUrl, setBillImageUrl] = useState(null);
  const [billImageFile, setBillImageFile] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [calculatedSubTotal, setCalculatedSubTotal] = useState(0);
  const [actualSubTotal, setActualSubTotal] = useState(0);


  useEffect(()=> {
    if(billDetails?.items)
    {
      setCalculatedSubTotal(billDetails.items.reduce((sum, item) => sum + Number(item.total), 0));
    }

  },[billDetails]);
  const handleImageChange = (event) =>{
    if(event.target.files && event.target.files[0])
    {
      setBillImageUrl(URL.createObjectURL(event.target.files[0]));
      const file = event.target.files[0];
      setBillImageFile(file);
    }
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
    
    const {output, status} = await response.json();
    console.log(output);
    // const data = {'restaurant': 'MIYA KEBABS (Andheri West)', 'items': [{'name': 'Dynamic Tangdi', 'quantity': 1, 'unit_price': 245, 'total': 245}, {'name': 'Angara Chicken Shawarma Roomali', 'quantity': 2, 'unit_price': 220, 'total': 440}, {'name': 'Chicken Kashmiri Tikka', 'quantity': 1, 'unit_price': 460, 'total': 460}, {'name': 'Mutton Seekh Kebabs', 'quantity': 1, 'unit_price': 450, 'total': 450}], 'summary': {'subtotal': 1605, 'taxes': {'SGST': 40.13, 'CGST': 40.13}, 'round_off': -0.26, 'grand_total': 1685}};
    // const billDetails = data;

    setBillDetails(output);
    setActualSubTotal(output.summary.subtotal);
    //console.log(`status:${status}, output:${output[0].content[0].text}`)

  };


    const handleCellChange = (index, field, value) => {

      setBillDetails(prev=>
      ({
        ...prev,
        items : prev.items.map((item, itemIndex)=>
        {
            if(itemIndex === index)
            {
              return {...item, [field]:Number(value)};
            }
            return item;
        })
      }));
      console.log(billDetails);
      
    }
    
    const handleBillUpdate = ()=> {
      console.log(billDetails);
      setCalculatedSubTotal(billDetails.items.reduce((sum, item) => sum + item.total, 0));
    }

  const normalTableCellClass = "border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase";
  const totalTableCellClass = "border border-gray-300 px-6 py-3 text-gray-800";

  const totalRowClass ="bg-gray-200 font-bold border-t-2 border-gray-400";
  const leftCellClass = "border border-gray-300 px-6 py-3 text-left";
  const rightCellClass = "border border-gray-300 px-6 py-3 text-right";
  return (
    <div className="flex flex-col items-center">
        <h1 className="text-xl bold font-bold mt-4"> Use your camera to capture the Bill</h1>
         <label
        htmlFor="bill-upload"
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
            
              <button className="mt-4 p-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow transition text-xl" onClick={handleUpload} >Bill Summary</button>

               <button className="ml-3 mt-4 p-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow transition text-xl" onClick={handleBillUpdate} >Update Bill</button>
            </div>
        )}

        {billDetails && (
  <div className="overflow-x-auto  mt-4 p-4">
    <table className="min-w-full border-collapse border border-gray-300 shadow-md">
      <thead className="bg-gray-100">
        <tr>
          <th className={normalTableCellClass}>
            Name
          </th>
          <th className={normalTableCellClass}>
            Quantity
          </th>
          <th className={normalTableCellClass}>
            Price
          </th>
          <th className={normalTableCellClass}>
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {billDetails?.items?.map((item,itemIndex) => (
          <tr
            key={itemIndex}
            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
          >
            <td className={totalTableCellClass}>{item.name}</td>
            <td className={totalTableCellClass}>{item.quantity}</td>
            <td className={totalTableCellClass}>
              {item.unit_price.toFixed(2)}
            </td>
            <td className="border border-gray-300 px-6 py-3 text-right font-semibold text-gray-900">
              <input
                value= {item.total}
                onChange={e => handleCellChange(itemIndex, "total", e.target.value)}
                className="w-full p-1 border rounded"
              />
             
            </td>
          </tr>
        ))}

        <tr className={totalRowClass}>
          <td className={leftCellClass} colSpan={3}>
            Subtotal
          </td>
          <td className="border border-gray-300 px-6 py-3 text-right">
            {actualSubTotal === calculatedSubTotal ? actualSubTotal : 
              (<p>
                  <span className="line-through mr-2 bg-red-400">{calculatedSubTotal}</span>
                  <span>{actualSubTotal}</span>
              </p>)
            }
        
          </td>
        </tr>
         <tr className={totalRowClass}>
          <td className={leftCellClass} colSpan={3}>
            SGST
          </td>
          <td className={rightCellClass}>
            ${billDetails.summary.taxes.SGST
              .toFixed(2)}
          </td>
          </tr>
          <tr className={totalRowClass}>
          <td className={leftCellClass} colSpan={3}>
            CGST
          </td>
          <td className={rightCellClass}>
            {billDetails.summary.taxes.CGST
              .toFixed(2)}
          </td>
        </tr>
         <tr className={totalRowClass}>
          <td className={leftCellClass} colSpan={3}>
              Round off
          </td>
          <td className={rightCellClass}>
            {billDetails.summary.round_off
              .toFixed(2)}
          </td>
        </tr>
          <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
          <td className={leftCellClass} colSpan={3}>
            Grand Total
          </td>
          <td className={rightCellClass}>
            {billDetails.summary.grand_total
              .toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

    </div>
  )
}

export default CameraCard;