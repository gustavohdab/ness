
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 md:px-8 border-t">
            <p className="text-center text-sm leading-loose text-muted-foreground">
                © {currentYear} AI Dev Matcher. A learning project.
            </p>
        </footer>
    );
} 