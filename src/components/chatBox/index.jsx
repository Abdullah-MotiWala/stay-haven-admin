import React from "react";

export default function TicketChatUI() {
  return (
    <div className="w-full min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">

        {/* Header */}
        <div className="flex justify-between border-b border-gray-300 items-center mb-4">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-0">Ticket ID <span className="text-blue">#321-01</span></p>
            <h2 className="text-2xl font-semibold">Payment failed during checkout</h2>
          </div>
          <button className="border text-blue border-blue px-4 py-1 rounded-full text-sm hover:bg-gray-100">
            Mark as Resolved
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Chat Box */}
          <div className="md:col-span-2 shadow-md border rounded-xl flex flex-col h-[520px]">

            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b p-2">
              <img
                src="https://i.pravatar.cc/40"
                className="w-15 h-15 rounded-full"
              />
              <div className="">
                <p className="font-medium mb-0">Admin Name</p>
                <p className="text-xs text-gray-500">Admin ID#23-01</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              <div className="max-w-[70%] bg-gray-100 p-3 rounded-lg text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <p className="text-xs text-right text-gray-400 mt-1">7:15 PM</p>
              </div>

              <div className="ml-auto max-w-[70%] bg-blue text-white p-3 rounded-lg text-sm">
                Lorem ipsum dolor sit amet
                <p className="text-xs text-right text-white mt-1">7:16 PM</p>
              </div>

              <div className="max-w-[70%] bg-gray-100 p-3 rounded-lg text-sm">
                Nullam hendrerit erat elit mattis.
                <p className="text-xs text-right text-gray-400 mt-1">7:18 PM</p>
              </div>

            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                placeholder="Type a message here..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button className="bg-blue text-white px-4 rounded-lg">
                ➤
              </button>
            </div>

          </div>

          {/* Ticket Details */}
          <div className="border rounded-xl p-4 h-fit">
            <h3 className="font-semibold mb-3">Ticket Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created on</span>
                <span>04 Sep 2025</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Open</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span>Support Team</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span>04 Sep 2025, 7:15 PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
