// Icons
import SearchIcon from '../../assets/icons/SearchIcon';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';

export default function TransactionsFilter({logLevels, searchQuery, fromDate, toDate, showLevelDropdown, selectedLevel, handleSearch,handleFromDateChange, handleToDateChange, handleLevelSelect, setShowLevelDropdown }) {

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      {/* Search */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search logs"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex items-center">
        <div className="absolute left-3 top-2 w-5 h-5 text-xl text-gray-400">
          From
        </div>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="relative flex items-center">
        <div className="absolute left-3 top-2 w-5 h-5 text-xl text-gray-400">
          To
        </div>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            min={fromDate} // Ensure "to" date can't be before "from" date
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            {selectedLevel}
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </button>
          
          {showLevelDropdown && (
            <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {logLevels.map((level) => (
                <div
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedLevel === level ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}