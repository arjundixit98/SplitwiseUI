import { useState, useEffect, useRef } from "react";

const BillTable = ({ billDetails, setBillDetails }) => {
  const normalTableCellClass =
    "border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase";

  const totalTableCellClass = "border border-gray-300 px-6 py-3 text-gray-800";

  const totalRowClass = "bg-gray-200 font-bold border-t-2 border-gray-400";
  const leftCellClass = "border border-gray-300 px-6 py-3 text-left";
  const rightCellClass = "border border-gray-300 px-6 py-3 text-right";
  const bottomCellClass = "border border-gray-300 px-6 py-3 align-text-center";

  const [calculatedSubTotal, setCalculatedSubTotal] = useState(0);
  const [actualSubTotal, setActualSubTotal] = useState(0);
  const [totalShareByUser, setTotalShareByUser] = useState({});

  const users = ["Arjun", "Divij", "Prajwal", "Aayush"];

  const itemSharedByNumberOfPeopleRef = useRef(new Map());

  const handleBillUpdate = () => {
    console.log(billDetails);
    setCalculatedSubTotal(
      billDetails.items.reduce((sum, item) => sum + item.total, 0)
    );
  };

  const handleCheckboxClicked = (username, itemName) => {
    console.log(username, itemName);
    const itemSharedByNumberOfPeople = itemSharedByNumberOfPeopleRef.current;
    const mapEntry = itemSharedByNumberOfPeople.get(itemName);
    const sharedBy = mapEntry.sharedBy;
    if (!sharedBy.has(username)) {
      sharedBy.set(username, 0);
      mapEntry.shareCount++;

      const newShareCount = mapEntry.shareCount;
      const amountPerUser = Number((mapEntry.total / newShareCount).toFixed(2));

      sharedBy.forEach((amount, username) => {
        sharedBy.set(username, amountPerUser);
      });
    } else {
      sharedBy.delete(username);
      mapEntry.shareCount--;

      const newShareCount = mapEntry.shareCount;
      const amountPerUser = Number((mapEntry.total / newShareCount).toFixed(2));
      sharedBy.forEach((amount, username) => {
        sharedBy.set(username, amountPerUser);
      });
    }

    const newShareByUser = { Arjun: 0, Divij: 0, Prajwal: 0, Aayush: 0 };

    itemSharedByNumberOfPeople.forEach((item) => {
      const sharedBy = item.sharedBy;
      sharedBy.forEach((amount, username) => {
        newShareByUser[username] += amount;
      });
    });

    setTotalShareByUser(newShareByUser);

    console.log(itemSharedByNumberOfPeople);
    console.log(newShareByUser);
  };

  const handleCellChange = (index, field, value) => {
    setBillDetails((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, [field]: Number(value) };
        }
        return item;
      }),
    }));
    console.log(billDetails);
  };

  useEffect(() => {
    if (billDetails?.items) {
      setCalculatedSubTotal(
        billDetails.items.reduce((sum, item) => sum + Number(item.total), 0)
      );
      setActualSubTotal(billDetails.summary.subtotal);

      const map = new Map();
      billDetails.items.forEach((item) => {
        map.set(item.name, {
          shareCount: 0,
          total: item.total,
          sharedBy: new Map(),
        });
      });
      itemSharedByNumberOfPeopleRef.current = map;
    }
  }, [billDetails]);

  return (
    <div>
      <div className="mt-4">
        {/* <button className="mt-4 p-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow transition text-xl" onClick={handleUpload} >Bill Summary</button> */}
        <button
          className="ml-3 mt-4 p-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow transition text-xl"
          onClick={handleBillUpdate}
        >
          Update Bill
        </button>
      </div>
      <div className="flex w-max">
        {billDetails && (
          <div className="max-w-8/12 flex mt-4 p-4">
            <table className="min-w-full border-collapse border border-gray-300 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className={normalTableCellClass}> Name </th>
                  <th className={normalTableCellClass}> Quantity </th>
                  <th className={normalTableCellClass}> Price </th>
                  <th className={normalTableCellClass}> Total </th>
                </tr>
              </thead>
              <tbody>
                {billDetails?.items?.map((item, itemIndex) => (
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
                        value={item.total}
                        onChange={(e) =>
                          handleCellChange(itemIndex, "total", e.target.value)
                        }
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
                    {actualSubTotal === calculatedSubTotal ? (
                      actualSubTotal
                    ) : (
                      <p>
                        <span className="line-through mr-2 bg-red-400">
                          {calculatedSubTotal}
                        </span>
                        <span>{actualSubTotal}</span>
                      </p>
                    )}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    {" "}
                    SGST{" "}
                  </td>
                  <td className={rightCellClass}>
                    {" "}
                    ${billDetails.summary.taxes.SGST.toFixed(2)}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    {" "}
                    CGST{" "}
                  </td>
                  <td className={rightCellClass}>
                    {" "}
                    {billDetails.summary.taxes.CGST.toFixed(2)}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    Round off{" "}
                  </td>
                  <td className={rightCellClass}>
                    {billDetails.summary.round_off.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
                  <td className={leftCellClass} colSpan={3}>
                    Grand Total
                  </td>
                  <td className={rightCellClass}>
                    {billDetails.summary.grand_total.toFixed(2)}{" "}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="min-w-full border-collapse border border-gray-300 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  {users.map((username) => (
                    <th className={normalTableCellClass}>{username}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billDetails?.items?.map((item, itemIndex) => (
                  <tr
                    key={itemIndex}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                  >
                    {users.map((username, index) => (
                      <td className={totalTableCellClass}>
                        <input
                          className="w-full p-1 border rounded"
                          type="checkbox"
                          onClick={() =>
                            handleCheckboxClicked(username, item.name)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* <tr className={totalRowClass}>
                  {users.map((username) => (
                    <td className={bottomCellClass}>
                      {totalShareByUser ? totalShareByUser[username] || 0 : 0}{" "}
                    </td>
                  ))}
                </tr> */}
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    Subtotal
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-right">
                    {actualSubTotal === calculatedSubTotal ? (
                      actualSubTotal
                    ) : (
                      <p>
                        <span className="line-through mr-2 bg-red-400">
                          {calculatedSubTotal}
                        </span>
                        <span>{actualSubTotal}</span>
                      </p>
                    )}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    {" "}
                    SGST{" "}
                  </td>
                  <td className={rightCellClass}>
                    {" "}
                    ${billDetails.summary.taxes.SGST.toFixed(2)}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    {" "}
                    CGST{" "}
                  </td>
                  <td className={rightCellClass}>
                    {" "}
                    {billDetails.summary.taxes.CGST.toFixed(2)}
                  </td>
                </tr>
                <tr className={totalRowClass}>
                  <td className={leftCellClass} colSpan={3}>
                    Round off{" "}
                  </td>
                  <td className={rightCellClass}>
                    {billDetails.summary.round_off.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
                  <td className={leftCellClass} colSpan={3}>
                    Grand Total
                  </td>
                  <td className={rightCellClass}>
                    {billDetails.summary.grand_total.toFixed(2)}{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillTable;
