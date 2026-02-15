import { Button } from '@/components/UXLib/Button/Button';
import { Card } from '@/components/UXLib/Card/Card';

export default function DesignTestPage() {
    return (
        <div className="p-10 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Design System Test</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Buttons</h2>
                <div className="flex gap-4">
                    <Button nameBtn="Primary" variant="contained" color="blue" />
                    <Button nameBtn="Secondary" variant="outlined" />
                    <Button nameBtn="Text" variant="text" />
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="p-4">
                            <h3 className="font-bold">Card Title</h3>
                            <p>This is a card from the design system.</p>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
