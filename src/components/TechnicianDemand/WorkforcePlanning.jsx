
// import "./WorkforcePlanning.css";

// export default function WorkforcePlanning({ planning = [] }) {
//   return (
//     <div className="planningCard">
//       <div className="planningHeader">
//         <h3>Workforce planning</h3>

//         <span>redeployment + cert pipeline</span>
//       </div>

//       <div className="planningBody">
//         {planning.map((item) => (
//           <div key={item.type} className="planningItem">
//             <h4>{item.title}</h4>

//             <p>{item.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import "./WorkforcePlanning.css";

export default function WorkforcePlanning({ planning = [] }) {
  return (
    <div className="planningCard">
      <div className="planningHeader">
        <h3>Workforce planning</h3>

        <span>redeployment + cert pipeline</span>
      </div>

      <div className="planningBody">
        {planning.map((item) => (
          <div
            key={item.type}
            className="planningItem"
          >
            <h4>{item.title}</h4>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}