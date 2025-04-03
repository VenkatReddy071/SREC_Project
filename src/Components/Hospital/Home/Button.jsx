export const Button = ({ label1, label2 }) => {
    return (
      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-black text-white font-semibold rounded">{label1}</button>
        {label2 && (
          <button className="px-4 py-2 border-2 border-black font-semibold rounded">{label2}</button>
        )}
      </div>
    );
  };
