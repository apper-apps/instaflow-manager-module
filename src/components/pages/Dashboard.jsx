import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data.filter(user => !user.isBlacklisted));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
  const totalUsers = users.length;
  const followedUsers = users.filter(u => u.followedBy && u.followedBy.length > 0).length;
  const followedBackUsers = users.filter(u => u.followedBack).length;
  const dmsSent = users.filter(u => u.dmSent).length;
  const repliesReceived = users.filter(u => u.responseStatus === 'Replied').length;
  const unfollowedUsers = users.filter(u => u.unfollowed).length;

  // Recent activity
  const recentUsers = users
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  const followBackRate = followedUsers > 0 ? ((followedBackUsers / followedUsers) * 100).toFixed(1) : 0;
  const responseRate = dmsSent > 0 ? ((repliesReceived / dmsSent) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Instagram user management overview</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon="Users"
          trend={{ direction: 'up', value: `${totalUsers} total` }}
        />
        <StatCard
          title="Followed Users"
          value={followedUsers}
          icon="UserPlus"
          trend={{ direction: 'up', value: `${followBackRate}% follow back` }}
        />
        <StatCard
          title="DMs Sent"
          value={dmsSent}
          icon="MessageCircle"
          trend={{ direction: 'up', value: `${responseRate}% response rate` }}
        />
        <StatCard
          title="Replies Received"
          value={repliesReceived}
          icon="MessageSquare"
          trend={{ direction: 'up', value: `${repliesReceived} replies` }}
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Followed Back"
          value={followedBackUsers}
          icon="UserCheck"
          trend={{ direction: 'up', value: `${followBackRate}% rate` }}
        />
        <StatCard
          title="Unfollowed"
          value={unfollowedUsers}
          icon="UserMinus"
          trend={{ direction: 'up', value: `${unfollowedUsers} total` }}
        />
        <StatCard
          title="Engagement Rate"
          value={`${responseRate}%`}
          icon="TrendingUp"
          trend={{ direction: 'up', value: 'Response rate' }}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <ApperIcon name="Clock" className="h-5 w-5 text-gray-400" />
        </div>
        
        {recentUsers.length > 0 ? (
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">@{user.username}</p>
                    <p className="text-sm text-gray-500">{user.accountSource}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {format(new Date(user.dateAdded), 'MMM dd, yyyy')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.followedBy && user.followedBy.length > 0 && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    )}
                    {user.followedBack && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                    {user.dmSent && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="Clock" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="UserPlus" className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-gray-900">To Follow</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => !u.followedBy || u.followedBy.length === 0).length}
            </p>
            <p className="text-sm text-gray-600">Users ready to follow</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="MessageCircle" className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-gray-900">To DM</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.followedBack && !u.dmSent).length}
            </p>
            <p className="text-sm text-gray-600">Users ready for DM</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="MessageSquare" className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Waiting Reply</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.dmSent && !u.responseStatus).length}
            </p>
            <p className="text-sm text-gray-600">Awaiting responses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;