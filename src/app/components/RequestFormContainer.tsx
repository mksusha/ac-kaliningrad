'use client';

import { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import RequestForm from './RequestForm';

const RequestFormContainer = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formStatus, setFormStatus] = useState<'initial' | 'submitted'>('initial');

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
        setFormStatus('initial');
    };

    const handleFormSubmit = () => {
        setFormStatus('submitted');
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setFormStatus('initial');
    };

    return (
        <div>
            <button
                onClick={toggleFormVisibility}
                className="bg-[#1E1E1E]/60 text-white font-semibold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg
    py-3 px-6 sm:py-4 sm:px-8 md:py-4 md:px-10 lg:py-3 lg:px-8 xl:py-4 xl:px-10 rounded-full border-2 border-[#C7E07A]
    transition-all duration-300 hover:bg-background hover:text-[#333333] hover:border-background
    w-full sm:w-auto"
            >
                Оставить заявку
            </button>

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 mx-4 rounded-lg shadow-lg w-full max-w-lg relative flex flex-col gap-4">
                        <button
                            onClick={closeForm}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes size={20}/>
                        </button>

                        {formStatus === 'initial' ? (
                            <RequestForm onSubmit={handleFormSubmit}/>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                <FaCheckCircle className="text-accent text-6xl mb-4"/>
                                <h2 className="text-lg font-semibold">Заявка успешно отправлена!</h2>
                                <button
                                    onClick={closeForm}
                                    className="mt-4 mx-4 bg-[#1E1E1E]/60 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:bg-[#333333]"
                                >
                                    Закрыть
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestFormContainer;
