import Modal from 'react-modal'
import React, { ReactNode, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleSubmit: (event: React.FormEvent) => void;
    newLimit: number;
    setNewLimit: (limit: number) => void;
}

const ModalComponent = ({ isOpen, closeModal, handleSubmit, newLimit, setNewLimit  } : ModalProps): ReactNode => {
    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-5 py-8 w-1/3 border border-black border-solid rounded-lg" contentLabel="Edit Threshold">
            <div className="flex items-center justify-between">
                <h2 className='text-lg font-bold'>Edit Threshold</h2>
                <button className='text-sm' onClick={closeModal}>Close</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className='text-sm'>Threshold</label>
                    <input type="number" value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))} className='border border-gray-300 w-full p-2 rounded-lg mt-2'/>
                </div>
                <div className="mt-4 flex justify-end">
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' type='submit' >Save</button>
                </div>
            </form>
        </Modal>
    )
}

export default ModalComponent;