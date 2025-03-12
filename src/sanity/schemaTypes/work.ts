import { defineType, defineField } from "sanity";

export default defineType({
    name: "work",
    title: "Примеры работ",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Название работы",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Слаг",
            type: "slug",
            options: {
                source: "title", // Слаг будет генерироваться на основе поля title
                maxLength: 96, // Максимальная длина слага
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "description",
            title: "Описание",
            type: "array",
            of: [
                {
                    type: "block", // Используем тип блоков для поддержки форматирования
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H1", value: "h1" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    lists: [
                        { title: "Bullet", value: "bullet" },
                        { title: "Numbered", value: "number" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Underline", value: "underline" },
                            { title: "Strikethrough", value: "strike-through" },
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        }),

        defineField({
            name: "images",
            title: "Фотографии",
            type: "array",
            of: [{ type: "image" }],
            options: {
                layout: "grid",
            },
        }),
    ],
});
