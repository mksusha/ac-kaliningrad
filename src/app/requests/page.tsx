"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthWrapper from "../components/AuthWrapper";

interface Request {
    id: number;
    phone: string;
    email: string;
    request_type: string;
    message: string;
    created_at: string;
    viewed: boolean;
}

interface OrderItem {
    id: number;
    phone: string;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
}

interface Order {
    id: number;
    phone: string;
    first_name: string;
    last_name: string;
    email: string;
    total_cost: number;
    status: string;
    created_at: string;
    order_items: OrderItem[];
    viewed: boolean;
}

const RequestsPage = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"requests" | "orders">("requests");
    const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
    const [hideViewed, setHideViewed] = useState<boolean>(false);
    const [expandedOrders, setExpandedOrders] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [{ data: requestsData, error: requestsError }, { data: ordersData, error: ordersError }] = await Promise.all([
                supabase.from("requests").select("*").order("created_at", { ascending: false }),
                supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
            ]);

            if (requestsError) throw new Error(`Ошибка загрузки заявок: ${requestsError.message}`);
            if (ordersError) throw new Error(`Ошибка загрузки заказов: ${ordersError.message}`);

            setRequests(requestsData || []);
            setOrders(ordersData || []);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sortByDate = (a: Request | Order, b: Request | Order) => {
        return sortOrder === "new"
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    };

    const toggleViewed = async (id: number, type: "requests" | "orders") => {
        if (type === "requests") {
            setRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, viewed: !req.viewed } : req))
            );
            await supabase.from("requests").update({ viewed: !requests.find((r) => r.id === id)?.viewed }).eq("id", id);
        } else {
            setOrders((prev) =>
                prev.map((order) => (order.id === id ? { ...order, viewed: !order.viewed } : order))
            );
            await supabase.from("orders").update({ viewed: !orders.find((o) => o.id === id)?.viewed }).eq("id", id);
        }
    };

    const deleteItem = async (id: number, type: "requests" | "orders") => {
        await supabase.from(type).delete().eq("id", id);
        if (type === "requests") {
            setRequests(requests.filter((item) => item.id !== id));
        } else {
            setOrders(orders.filter((item) => item.id !== id));
        }
    };

    const toggleOrderDetails = (id: number) => {
        setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <AuthWrapper>
            <div className="max-w-4xl my-8 md:my-12 mx-auto p-4 sm:p-2">
                <h1 className="text-3xl sm:text-2xl font-bold mb-6">Все заявки и заказы</h1>

                {error && <p className="text-red-500">{error}</p>}

                {/* Кнопки переключения вкладок */}
                <div className="flex sm:space-x-4 mb-6 sm:flex-row sm:justify-start sm:w-full sm:gap-4 sm:mb-6">
                    <button
                        className={`px-4 py-2 sm:px-3 mr-2 sm:py-1 w-full sm:w-auto rounded-md ${
                            activeTab === "requests" ? "bg-accent text-foreground" : "bg-foreground/20"
                        }`}
                        onClick={() => setActiveTab("requests")}
                    >
                        Заявки
                    </button>
                    <button
                        className={`px-4 py-2 sm:px-3 sm:py-1 w-full sm:w-auto rounded-md ${
                            activeTab === "orders" ? "bg-accent text-foreground" : "bg-foreground/20"
                        }`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Заказы
                    </button>
                </div>
                {/* Фильтры */}
                <div className="flex flex-col space-y-4 w-full md:w-auto lg:w-auto md:flex-row justify-start mb-4">
                    <button
                        className="px-4 py-2 sm:px-3 sm:py-1 w-full sm:w-auto bg-foreground/20 rounded-md"
                        onClick={() => setSortOrder(sortOrder === "new" ? "old" : "new")}
                    >
                        {sortOrder === "new" ? "Сначала старые" : "Сначала новые"}
                    </button>
                    <label className="flex items-center md:ml-5 sm:mt-0 mt-2 text-base">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={hideViewed}
                            onChange={() => setHideViewed(!hideViewed)}
                        />
                        Скрыть просмотренные
                    </label>
                </div>




            {/* Блок заявок */}
            {activeTab === "requests" && (
                <div>
                    <h2 className="text-2xl sm:text-xl font-semibold mb-4">Заявки</h2>
                    {requests.filter(r => !hideViewed || !r.viewed).length === 0 ? (
                        <p>Нет заявок</p>
                    ) : (
                        <ul className="space-y-4">
                            {requests.filter(r => !hideViewed || !r.viewed).sort(sortByDate).map((request) => (
                                <li
                                    key={request.id}
                                    className={`border p-4 sm:p-3 rounded-md shadow ${
                                        request.viewed ? "bg-foreground/10" : "bg-white"
                                    }`}
                                >
                                    <p><strong>Телефон:</strong> {request.phone}</p>
                                    <p><strong>Email:</strong> {request.email}</p>
                                    <p><strong>Тип запроса:</strong> {request.request_type}</p>
                                    <p><strong>Сообщение:</strong> {request.message}</p>
                                    <p className="text-sm mb-2 text-gray-500">Дата: {new Date(request.created_at).toLocaleString()}</p>

                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => toggleViewed(request.id, "requests")}
                                                className="bg-accent text-foreground px-3 py-1 rounded-md">
                                            {request.viewed ? "Снять просмотр" : "Просмотрено"}
                                        </button>
                                        <button onClick={() => deleteItem(request.id, "requests")}
                                                className="bg-foreground text-white px-3 py-1 rounded-md">
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Блок заказов */}
            {activeTab === "orders" && (
                <div>
                    <h2 className="text-2xl sm:text-xl font-semibold mb-4">Заказы</h2>
                    {orders.length === 0 ? (
                        <p>Нет заказов</p>
                    ) : (
                        <ul className="space-y-4 overflow-x-auto">
                            {orders.filter(o => !hideViewed || !o.viewed).sort(sortByDate).map((order) => (
                                <li key={order.id} className="border p-4 sm:p-3 rounded-md shadow bg-white">
                                    <p>
                                        <strong>Клиент:</strong> {order.first_name} {order.last_name} ({order.email}, {order.phone})
                                    </p>
                                    <p><strong>Сумма:</strong> {order.total_cost} руб.</p>
                                    <p><strong>Статус:</strong> {order.status}</p>
                                    <p className="text-sm mb-2 text-gray-500">Дата: {new Date(order.created_at).toLocaleString()}</p>

                                    {/* Кнопка раскрытия деталей заказа */}
                                    <button
                                        onClick={() => toggleOrderDetails(order.id)}
                                        className="bg-background mb-2 md:mb-0 border border-foreground text-foreground mr-2 px-3 py-1 rounded-md w-full sm:w-full"
                                    >
                                        {expandedOrders[order.id] ? "Скрыть детали" : "Показать детали"}
                                    </button>

                                    {/* Детали заказа */}
                                    {expandedOrders[order.id] && (
                                        <div className="mt-3 p-3 mb-4 bg-foreground/5 rounded-xl">
                                            <h3 className="text-lg sm:text-md font-semibold">Товары в заказе:</h3>
                                            {order.order_items.length > 0 ? (
                                                <ul className="mt-2 mb-2 space-y-2">
                                                    {order.order_items.map((item) => (
                                                        <li key={item.id} className="flex justify-between p-2 border-b">
                                                            <span>{item.product_name}</span>
                                                            <span className='ml-1'>{item.quantity} x {item.price} руб. = {item.total} руб.</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500 mt-2">Нет товаров в заказе.</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Кнопки управления заказом */}
                                    <div className="flex flex-col gap-2 sm:mt-3">
                                        <button
                                            onClick={() => toggleViewed(order.id, "orders")}
                                            className={`px-3 py-2 rounded-md border w-full ${
                                                order.viewed
                                                    ? "bg-transparent border-accent"
                                                    : "bg-accent text-foreground border-transparent"
                                            }`}
                                        >
                                            {order.viewed ? "Снять просмотр" : "Просмотрено"}
                                        </button>

                                        <button onClick={() => deleteItem(order.id, "orders")}
                                                className="bg-foreground text-white px-3 py-2 rounded-md w-full">
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
</AuthWrapper>
)
    ;

};

export default RequestsPage;
