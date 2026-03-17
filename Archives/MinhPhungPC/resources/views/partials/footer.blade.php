<footer class="footer-gradient py-4 text-white mt-auto">
    <div class="container text-center">
        <div class="row">
            <div class="col-12 col-md-4 mb-4 mb-md-0">
                <h5>Contact Us</h5>
                <p>
                    <strong>Email:</strong>
                    <a href="mailto:binhangia241273@gmail.com" class="text-white">binhangia241273@gmail.com</a><br>
                    <strong>Phone:</strong>
                    <a href="tel:+84907067721" class="text-white">0907067721</a>
                </p>
                <a href="{{ route('builder') }}" class="navbar-brand d-inline-block" style="max-width: 160px;">
                    <img src="{{ asset('logo_light.png') }}" alt="MinhPhungPC Logo" class="img-fluid">
                </a>
            </div>
            <div class="col-12 col-md-4 mb-4 mb-md-0">
                <h5>About Us</h5>
                <p>MinhPhungPC helps you build the ideal PC with expert recommendations for gaming, design, or daily use. Our dedicated team provides personalized solutions and outstanding customer service to ensure you find the perfect setup for your needs.</p>
            </div>
            <div class="col-12 col-md-4 mb-4 mb-md-0">
                <h5>See on GitHub</h5>
                <a href="https://github.com/JoshiMinh/MinhPhungPC" target="_blank" class="text-white mx-2" style="font-size: 2rem;">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
        <p class="mt-3 mb-0">&copy; {{ now()->year }} MinhPhungPC. All Rights Reserved.</p>
    </div>
</footer>
