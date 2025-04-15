export default function Footer() {
    return (
        <footer className="border-t bg-background py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} MapDashboard. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:underline">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:underline">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:underline">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    )
}
