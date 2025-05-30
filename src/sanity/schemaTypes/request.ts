
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
                list: ["consultation", "order_service", "order_product"],
            },
        },
        {
            name: "message",
            title: "Сообщение",
            type: "text",
        },
    ],
};
