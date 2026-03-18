-- Junction table linking a "resolver" invoice to the invoices it settled
CREATE TABLE invoice_resolutions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resolver_invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  resolved_invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (resolver_invoice_id, resolved_invoice_id)
);

CREATE INDEX ON invoice_resolutions (resolver_invoice_id);
CREATE INDEX ON invoice_resolutions (resolved_invoice_id);
