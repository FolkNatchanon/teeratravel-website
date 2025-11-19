export default function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
    return (
        <div id={id} className="text-center my-10 sm:my-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{children}</h2>
        </div>
    );
}