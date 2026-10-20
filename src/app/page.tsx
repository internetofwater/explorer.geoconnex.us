import '@/app/envConfig.ts';
import App from '@/app/App';

export default function Home() {
    return (
        <div>
            <App accessToken={process.env.MAPBOX_ACCESS_TOKEN ?? ''} />
        </div>
    );
}
