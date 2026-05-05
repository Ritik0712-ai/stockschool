import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineDocumentText } from "react-icons/hi";
import { format } from "date-fns";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session!.user.id },
    include: {
      transactions: {
        orderBy: { timestamp: "desc" }
      }
    }
  });

  const transactions = portfolio?.transactions || [];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        
        <Link href="/trade" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
          <HiOutlineArrowLeft /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-heading font-bold mb-8">Transaction History</h1>

        {transactions.length === 0 ? (
          <div className="glass rounded-xl p-12 border border-white/10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
              <HiOutlineDocumentText size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
            <p className="text-white/50 mb-6">Your trade history will appear here once you buy or sell stocks.</p>
            <Link href="/trade" className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors">
              Start Trading
            </Link>
          </div>
        ) : (
          <div className="glass rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 font-medium text-white/50 text-sm">Date</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Stock</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Type</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Qty</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Price</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Total</th>
                    <th className="p-4 font-medium text-white/50 text-sm">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="p-4 text-white/80 whitespace-nowrap">{format(t.timestamp, "MMM d, yyyy HH:mm")}</td>
                      <td className="p-4 font-semibold">{t.symbol}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'BUY' ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-500'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4">{t.quantity}</td>
                      <td className="p-4">{formatCurrency(t.price)}</td>
                      <td className="p-4 font-medium">{formatCurrency(t.total)}</td>
                      <td className="p-4 text-white/50 italic text-sm truncate max-w-xs" title={t.notes || ""}>
                        {t.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
