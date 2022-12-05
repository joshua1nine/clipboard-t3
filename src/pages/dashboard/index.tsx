import Link from "next/link";
import React from "react";
import Header from "../../components/Header";

const Dashboard = () => {
  return (
    <div className="page">
      <Header title="Dashboard" />
      <main className="relative mx-auto max-w-4xl px-3">
        <div>
          <Link href="/dashboard/reservations">Reservations</Link>
        </div>
        <div>
          <Link href="/dashboard/resources">Resources</Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
