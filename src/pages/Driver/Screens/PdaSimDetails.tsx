import React from 'react';
import SaveAndNew from '../../../components/Buttons/SaveAndNew';
import SaveAndClose from '../../../components/Buttons/SaveAndClose';

const PdaSimDetails = () => {
    return (
        <div className="p-4 ">
            <div className="rounded-b-lg max-w-2xl">
                <div className="mb-6">
                    <h3 className="font-bold text-2xl text-gray-700 mb-4 dark:text-white text-black">PDA/SIM Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">IMEI</span>
                            <input
                                type="text"
                                placeholder='IMEI'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">Make</span>
                            <input
                                type="text"
                                placeholder='Make'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">Model</span>
                            <input
                                type="text"
                                placeholder='Model'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">PDA Date Given</span>
                            <input
                                type="date"
                                placeholder='PDA Date Given'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">SIM Network Name</span>
                            <input
                                type="text"
                                placeholder='SIM Network Name'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">SIM Number</span>
                            <input
                                type="text"
                                placeholder='SIM Number'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">Network APN</span>
                            <input
                                type="text"
                                placeholder='Network APN'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">Data Allowance</span>
                            <input
                                type="text"
                                placeholder='Data Allowance'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                        <label className="flex flex-col">
                            <span className="dark:text-white text-black">PDA Deposits</span>
                            <input
                                type="text"
                                placeholder='PDA Deposits'
                                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                        </label>
                    </div>
                    <label className="flex flex-col mt-4">
                        <span className="dark:text-white text-black">Comments</span>
                        <textarea placeholder='Write here...' className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                    </label>
                    <label className="flex flex-col mt-4">
                        <span className="dark:text-white text-black">SUM UP Affiliate Key</span>
                        <input
                            type="text"
                            placeholder='IMEI'
                            className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600" />
                    </label>
                </div>
            </div>
            <div className="flex flex-row-reverse gap-3 my-3 mx-1">
                <button>
                    <SaveAndNew />
                </button>
                <button>
                    <SaveAndClose />
                </button>
            </div>
        </div>
    );
};

export default PdaSimDetails;
