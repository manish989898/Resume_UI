import { useState } from 'react';

// Redux 
import { useSelector } from 'react-redux';

// Components
import TransactionTable from './TransactionTable';
import TransactionsFilter from './TransactionsFilter';

const levelColors = {
  INFO: 'bg-blue-100 text-blue-600',
  ERROR: 'bg-red-100 text-red-600',
  WARNING: 'bg-yellow-100 text-yellow-600',
};

export default function Transactions() {

  const logs = useSelector((state) => state.transactions.transactions)

  const logLevels = logs.map(ele => ele.level).filter((value, i, self) => {
    return self.indexOf(value) === i
  })

  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  
    const handleSearch = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
    };
  
    const handleFromDateChange = (e) => {
      const date = e.target.value;
      setFromDate(date);
    };
  
    const handleToDateChange = (e) => {
      const date = e.target.value;
      setToDate(date);
    };
  
    const handleLevelSelect = (level) => {
      setSelectedLevel(level);
      setShowLevelDropdown(false);
    };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Trail</h1>
        <p className="text-sm text-gray-500">Know what happened, when, and by whom.</p>

        <hr className='mt-4 border-gray-200' />
      </div>

     {/* Filter Section */}
     <TransactionsFilter logLevels={logLevels} searchQuery={searchQuery} fromDate={fromDate} toDate={toDate} 
     showLevelDropdown={showLevelDropdown} selectedLevel={selectedLevel} handleSearch={handleSearch} handleFromDateChange={handleFromDateChange} handleToDateChange={handleToDateChange} handleLevelSelect={handleLevelSelect} 
     setShowLevelDropdown={setShowLevelDropdown} />

      {/* Table */}
      <TransactionTable logs={logs} levelColors={levelColors} />
      
    </div>
  );
}
