import csv
import json
import os
import re

def parse_header(header_string):
    """Parses header for weight range and price type."""
    # Normalize parentheses
    header_string = header_string.replace('（', '(').replace('）', ')')

    # Check for base weight
    base_match = re.search(r'首重\((\d+)kg\)', header_string)
    if base_match:
        return {"type": "base", "weight": int(base_match.group(1))}

    # Check for tiered extra weight
    tier_match = re.search(r'续重\d+\((\d+)-(\d+)kg\)', header_string)
    if tier_match:
        return {
            "type": "tier",
            "min_weight": int(tier_match.group(1)),
            "max_weight": int(tier_match.group(2))
        }

    # Check for tiered extra weight with open end
    tier_above_match = re.search(r'续重\d+\((\d+)kg及以上\)', header_string)
    if tier_above_match:
        return {
            "type": "tier",
            "min_weight": int(tier_above_match.group(1)),
            "max_weight": 99999
        }

    return None

def process_file(filepath, company_name):
    """Processes a single CSV file and converts it to a structured dictionary."""
    data = {"company": company_name, "pricing": []}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = list(csv.reader(f))
            if not reader:
                return data
            
            headers = reader[0]
            rows = reader[1:]

            parsed_headers = [parse_header(h) for h in headers]
            
            base_weight_info = parsed_headers[1] if len(parsed_headers) > 1 else None
            base_weight = base_weight_info['weight'] if base_weight_info and base_weight_info.get('type') == 'base' else 0

            for row in rows:
                if not row or not any(cell.strip() for cell in row):
                    continue

                destination = row[0]
                try:
                    base_price = float(row[1]) if len(row) > 1 and row[1] else 0.0
                except (ValueError, IndexError):
                    base_price = 0.0

                extra_weight_tiers = []
                for i, cell in enumerate(row[2:], start=2):
                    try:
                        price = float(cell)
                        if price > 0:
                            header_info = parsed_headers[i]
                            if header_info and header_info.get('type') == 'tier':
                                extra_weight_tiers.append({
                                    "min_weight": header_info['min_weight'],
                                    "max_weight": header_info['max_weight'],
                                    "price_per_kg": price
                                })
                    except (ValueError, IndexError):
                        continue
                
                # Only add if there is some pricing info
                if base_price > 0 or extra_weight_tiers:
                    data["pricing"].append({
                        "destination": destination.strip(),
                        "base_weight_kg": base_weight,
                        "base_price": base_price,
                        "extra_weight_tiers": extra_weight_tiers
                    })
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
    except Exception as e:
        print(f"An error occurred while processing {filepath}: {e}")
        
    return data

def main():
    """Main function to convert all CSV files to JSON."""
    files_to_process = {
        'annengbz.csv': '安能快运-标准',
        'annengdsd.csv': '安能快運-大件',
        'jym.csv': '极兔速递',
        'shunxin.csv': '顺心捷达',
        'yunda.csv': '韵达快运'
    }

    output_dir = 'data'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    all_data = []
    for filename, company in files_to_process.items():
        processed_data = process_file(filename, company)
        if processed_data["pricing"]:
            all_data.append(processed_data)
        
            # Write individual files
            output_filename = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}.json")
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(processed_data, f, ensure_ascii=False, indent=2)
            print(f"Successfully converted {filename} to {output_filename}")

    # Write a combined file
    if all_data:
        combined_filename = os.path.join(output_dir, 'pricing_data.json')
        with open(combined_filename, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully created combined data file at {combined_filename}")

if __name__ == '__main__':
    main()
