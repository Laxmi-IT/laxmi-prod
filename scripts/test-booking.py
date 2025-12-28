#!/usr/bin/env python3
"""Test the LAXMI ultra-luxury consultation request page."""

from playwright.sync_api import sync_playwright
import time

def test_booking_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("Testing consultation request page...")

        # Navigate to booking page
        page.goto('http://localhost:3000/book')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        # Take screenshot of the page
        page.screenshot(path='/tmp/laxmi-screenshots/consultation-request.png', full_page=True)
        print("Captured consultation request page screenshot")

        # Check for ultra-luxury elements
        print("\nChecking ultra-luxury elements...")

        # Check title
        title = page.locator('h1:has-text("Request a Consultation")')
        print(f"  Title 'Request a Consultation': {'Found' if title.count() else 'Missing'}")

        # Check tagline
        tagline = page.locator('text=By Appointment Only')
        print(f"  'By Appointment Only' tagline: {'Found' if tagline.count() else 'Missing'}")

        # Check concierge messaging
        concierge_msg = page.locator('text=design concierge')
        print(f"  'Design concierge' messaging: {'Found' if concierge_msg.count() else 'Missing'}")

        # Check form elements
        print("\nChecking form elements...")
        name_input = page.locator('input[placeholder="Your full name"]')
        email_input = page.locator('input[placeholder="your@email.com"]')
        submit_btn = page.locator('button:has-text("REQUEST CONSULTATION")')

        print(f"  Name input: {'Found' if name_input.count() else 'Missing'}")
        print(f"  Email input: {'Found' if email_input.count() else 'Missing'}")
        print(f"  'REQUEST CONSULTATION' button: {'Found' if submit_btn.count() else 'Missing'}")

        # Check sidebar
        print("\nChecking 'The Experience' sidebar...")
        experience = page.locator('text=The Experience')
        request_step = page.locator('text=Share your vision')
        connect_step = page.locator('text=Personal call from our design concierge')

        print(f"  'The Experience' section: {'Found' if experience.count() else 'Missing'}")
        print(f"  Request step: {'Found' if request_step.count() else 'Missing'}")
        print(f"  Connect step: {'Found' if connect_step.count() else 'Missing'}")

        # Check contact email updated
        contact_email = page.locator('text=thelaxmii07@gmail.com')
        print(f"\n  Contact email (thelaxmii07@gmail.com): {'Found' if contact_email.count() else 'Missing'}")

        # Fill form and take screenshot
        print("\nFilling form...")
        name_input.fill('Maria Rossi')
        email_input.fill('maria@example.com')

        phone_input = page.locator('input[placeholder*="XXX"]')
        if phone_input.count():
            phone_input.fill('+39 02 1234 5678')

        # Set date
        from datetime import datetime, timedelta
        tomorrow = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
        date_input = page.locator('input[type="date"]')
        if date_input.count():
            date_input.fill(tomorrow)

        # Select time
        time_select = page.locator('select')
        if time_select.count():
            time_select.select_option('14:00')

        # Fill message
        textarea = page.locator('textarea')
        if textarea.count():
            textarea.fill('I am interested in furnishing my new penthouse in Milan with authentic Italian craftsmanship. Looking for a complete living room and master bedroom design.')

        page.screenshot(path='/tmp/laxmi-screenshots/consultation-filled.png', full_page=True)
        print("Captured filled form screenshot")

        browser.close()
        print("\nConsultation request page test complete!")

if __name__ == '__main__':
    import os
    os.makedirs('/tmp/laxmi-screenshots', exist_ok=True)
    test_booking_page()
