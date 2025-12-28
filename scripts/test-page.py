from playwright.sync_api import sync_playwright
import os

def test_laxmi_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("Navigating to LAXMI landing page...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        # Create output directory
        os.makedirs('/tmp/laxmi-screenshots', exist_ok=True)

        # Take full page screenshot
        print("Taking full page screenshot...")
        page.screenshot(path='/tmp/laxmi-screenshots/full-page.png', full_page=True)

        # Take hero section screenshot
        print("Taking hero section screenshot...")
        page.screenshot(path='/tmp/laxmi-screenshots/hero-section.png')

        # Scroll to services section and take screenshot
        print("Scrolling to services section...")
        page.evaluate("window.scrollBy(0, window.innerHeight * 2)")
        page.wait_for_timeout(500)
        page.screenshot(path='/tmp/laxmi-screenshots/services-section.png')

        # Check for images
        print("\n--- IMAGE ANALYSIS ---")
        images = page.locator('img').all()
        print(f"Total images found: {len(images)}")

        for i, img in enumerate(images):
            src = img.get_attribute('src')
            alt = img.get_attribute('alt')
            is_visible = img.is_visible()
            box = img.bounding_box() if is_visible else None

            print(f"\nImage {i+1}:")
            print(f"  src: {src}")
            print(f"  alt: {alt}")
            print(f"  visible: {is_visible}")
            if box:
                print(f"  size: {box['width']:.0f}x{box['height']:.0f}")
            else:
                print(f"  size: not rendered (0x0 or hidden)")

        # Check for any broken images (images with naturalWidth = 0)
        print("\n--- CHECKING FOR BROKEN IMAGES ---")
        broken_images = page.evaluate('''() => {
            const imgs = document.querySelectorAll('img');
            const broken = [];
            imgs.forEach((img, i) => {
                if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                    broken.push({
                        index: i,
                        src: img.src,
                        alt: img.alt
                    });
                }
            });
            return broken;
        }''')

        if broken_images:
            print(f"Found {len(broken_images)} broken images:")
            for img in broken_images:
                print(f"  - {img['src']} (alt: {img['alt']})")
        else:
            print("No broken images found!")

        # Check the hero section specifically
        print("\n--- HERO SECTION ANALYSIS ---")
        hero_html = page.evaluate('''() => {
            const heroSection = document.querySelector('section');
            if (heroSection) {
                const imgs = heroSection.querySelectorAll('img');
                return {
                    hasImages: imgs.length > 0,
                    imageCount: imgs.length,
                    firstImageSrc: imgs[0]?.src || null,
                    sectionHeight: heroSection.offsetHeight
                };
            }
            return null;
        }''')
        print(f"Hero section info: {hero_html}")

        # Get console errors
        print("\n--- CONSOLE ERRORS ---")
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.reload()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)

        if errors:
            for err in errors:
                print(f"  Error: {err}")
        else:
            print("No console errors found!")

        browser.close()

        print("\n--- SCREENSHOTS SAVED ---")
        print("Full page: /tmp/laxmi-screenshots/full-page.png")
        print("Hero section: /tmp/laxmi-screenshots/hero-section.png")
        print("Services section: /tmp/laxmi-screenshots/services-section.png")

if __name__ == "__main__":
    test_laxmi_page()
