// schemas/request.js
export default {
    name: "request",
    title: "Заявка",
    type: "document",
    fields: [
        {
            name: "phone",
            title: "Номер телефона",
            type: "string",
        },
        {
            name: "email",
            title: "Email",
            type: "string",
        },
        {
            name: "requestType",
            title: "Тип запроса",
            type: "string",
            options: {
                list: ["consultation", "order_service", "order_product"], // Типы запросов
            },
        },
        {
            name: "message",
            title: "Сообщение",
            type: "text",
        },
    ],
};
