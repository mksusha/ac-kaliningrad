'use client';

import { useState } from 'react';

interface RequestFormProps {
    onSubmit: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        requestType: '',
        message: '',
    });
    const [status, setStatus] = useState<'initial' | 'submitted'>('initial');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitted');

        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('submitted');
                onSubmit();
            } else {
                setStatus('initial');
            }
        } catch (error) {
            setStatus('initial');
        }
    };

    if (status === 'submitted') return null;

    return (
        <form onSubmit={handleSubmit}
              className="bg-white mx-4 m-auto w-auto rounded-2xl max-w-lg relative flex flex-col gap-4">
            <div>
                <label htmlFor="phone">Номер телефона</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#C7E07A]"
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#C7E07A]"
                />
            </div>
            <div>
                <label htmlFor="requestType">Тип запроса</label>
                <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#C7E07A]"
                >
                    <option value="">Выберите тип</option>
                    <option value="Консультация">Консультация</option>
                    <option value="Услуга">Услуга</option>
                    <option value="Товар">Товар</option>
                </select>
            </div>
            <div>
                <label htmlFor="message">Сообщение</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#C7E07A]"
                />
            </div>
            <button
                type="submit"
                className="bg-[#1E1E1E]/60 text-white py-2 px-6 rounded-2xl transition-all duration-300 hover:bg-[#333333] hover:shadow-lg"
            >
                Отправить заявку
            </button>

        </form>


    );
};

export default RequestForm;
