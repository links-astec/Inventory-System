import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notification {
  id: number;
  message: string;
  created_at: string;
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const previousCountRef = useRef(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = () => {
    api.get<Notification[]>('notifications/')
      .then(res => {
        // Toast new notifications
        if (res.data.length > previousCountRef.current) {
          const newCount = res.data.length - previousCountRef.current;
          toast.info(`${newCount} new notification${newCount > 1 ? 's' : ''}`);
        }

        previousCountRef.current = res.data.length;
        setNotifications(res.data);
      })
      .catch(() => toast.error('Failed to fetch notifications.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-lg font-bold mb-3">Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notif => (
            <li key={notif.id} className="border-b pb-2 text-sm">
              <span className="font-medium text-blue-600">•</span> {notif.message}
              <div className="text-gray-400 text-xs mt-1">
                {new Date(notif.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
