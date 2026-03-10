import React, { useState } from 'react';

// Packages and Libraries
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2'

export default function ProcessSchedule() {
  const [isRunning, setIsRunning] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [scheduleTime, setScheduleTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0))
  );

  const handleRunNow = async () => {
    setIsRunning(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Process completed successfully');
      Swal.fire('Process completed successfully!');
    } catch (error) {
      console.error('Error running process:', error);
      Swal.fire('Failed to run process!');
    } finally {
      setIsRunning(false);
    }
  };

  const handleScheduleLater = async () => {
    if (!showScheduleForm) {
      setShowScheduleForm(true);
      return;
    }

    setIsScheduling(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(
        scheduleDate.getFullYear(),
        scheduleDate.getMonth(),
        scheduleDate.getDate(),
        scheduleTime.getHours(),
        scheduleTime.getMinutes()
      );

      // Validate the date is in the future
      if (scheduledDateTime < new Date()) {
        Swal.fire('Please select a future date and time');
        return;
      }

      // Simulate API call with the scheduled datetime
      console.log('Scheduling for:', scheduledDateTime);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Process scheduled successfully');
      Swal.fire(`Process scheduled successfully for ${scheduledDateTime.toString()}`);
      setShowScheduleForm(false);
    } catch (error) {
      console.error('Error scheduling process:', error);
      Swal.fire('Failed to schedule process!');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="flex-1 p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Process Schedule</h2>
        <p className="text-gray-500">Run your process now or schedule it later.</p>
        <hr className='mt-4 border-gray-200' />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleRunNow}
          disabled={isRunning || isScheduling}
          className={`p-4 rounded-sm text-xl transition duration-300 cursor-pointer ${
            isRunning || isScheduling 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#1B61AD] text-white hover:bg-white hover:text-[#1B61AD] hover:border-2 hover:border-[#1B61AD]'
          }`}
        >
          {isRunning ? 'Running...' : 'Run Now'}
        </button>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleScheduleLater}
            disabled={isRunning || isScheduling}
            className={`p-4 rounded-sm text-xl transition duration-300 cursor-pointer ${
              isRunning || isScheduling 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-400 text-white hover:bg-white hover:text-blue-400 hover:border-2 hover:border-blue-400'
            }`}
          >
            {isScheduling ? 'Scheduling...' : showScheduleForm ? 'Confirm Schedule' : 'Schedule Later'}
          </button>
          
          {showScheduleForm && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <DatePicker
                  selected={scheduleDate}
                  onChange={(date) => setScheduleDate(date)}
                  minDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <DatePicker
                  selected={scheduleTime}
                  onChange={(time) => setScheduleTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}