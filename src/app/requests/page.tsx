"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Все заявки и заказы</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("requests")}
                >
                    Заявки
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("orders")}
                >
                    Заказы
                </button>
            </div>

            <div className="flex justify-between mb-4">
                <button
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setSortOrder(sortOrder === "new" ? "old" : "new")}
                >
                    {sortOrder === "new" ? "Сначала старые" : "Сначала новые"}
                </button>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={hideViewed}
                        onChange={() => setHideViewed(!hideViewed)}
                    />
                    Скрыть просмотренные
                </label>
            </div>
            {activeTab === "requests" && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Заявки</h2>
                    {requests.filter(r => !hideViewed || !r.viewed).length === 0 ? (
                        <p>Нет заявок</p>
                    ) : (
                        <ul className="space-y-4">
                            {requests.filter(r => !hideViewed || !r.viewed).sort(sortByDate).map((request) => (
                                <li key={request.id} className={`border p-4 rounded-md shadow ${request.viewed ? "bg-gray-200" : "bg-white"}`}>
                                    <p><strong>Телефон:</strong> {request.phone}</p>
                                    <p><strong>Email:</strong> {request.email}</p>
                                    <p><strong>Тип запроса:</strong> {request.request_type}</p>
                                    <p><strong>Сообщение:</strong> {request.message}</p>
                                    <p className="text-sm text-gray-500">Дата: {new Date(request.created_at).toLocaleString()}</p>
                                    <button onClick={() => toggleViewed(request.id, "requests")} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">
                                        {request.viewed ? "Снять просмотр" : "Просмотрено"}
                                    </button>
                                    <button onClick={() => deleteItem(request.id, "requests")} className="bg-red-500 text-white px-3 py-1 rounded-md">
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {/* Блок заказов */}
            {activeTab === "orders" && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Заказы</h2>
                    {orders.length === 0 ? (
                        <p>Нет заказов</p>
                    ) : (
                        <ul className="space-y-4">
                            {orders.filter(o => !hideViewed || !o.viewed).sort(sortByDate).map((order) => (
                                <li key={order.id} className="border p-4 rounded-md shadow bg-white">
                                    <p>
                                        <strong>Клиент:</strong> {order.first_name} {order.last_name} ({order.email}, {order.phone})
                                    </p>
                                    <p><strong>Сумма:</strong> {order.total_cost} руб.</p>
                                    <p><strong>Статус:</strong> {order.status}</p>
                                    <p className="text-sm text-gray-500">Дата: {new Date(order.created_at).toLocaleString()}</p>

                                    <button onClick={() => toggleOrderDetails(order.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                                        {expandedOrders[order.id] ? "Скрыть детали" : "Показать детали"}
                                    </button>

                                    {expandedOrders[order.id] && (
                                        <div className="mt-3 p-3 bg-gray-100 rounded-md">
                                            <h3 className="text-lg font-semibold">Товары в заказе:</h3>
                                            {order.order_items.length > 0 ? (
                                                <ul className="mt-2 space-y-2">
                                                    {order.order_items.map((item) => (
                                                        <li key={item.id} className="flex justify-between p-2 border-b">
                                                            <span>{item.product_name}</span>
                                                            <span>{item.quantity} x {item.price} руб. = {item.total} руб.</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500 mt-2">Нет товаров в заказе.</p>
                                            )}
                                        </div>
                                    )}

                                    <button onClick={() => toggleViewed(order.id, "orders")} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">
                                        {order.viewed ? "Снять просмотр" : "Просмотрено"}
                                    </button>
                                    <button onClick={() => deleteItem(order.id, "orders")} className="bg-red-500 text-white px-3 py-1 rounded-md">
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestsPage;
