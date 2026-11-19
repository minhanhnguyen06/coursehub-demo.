import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

function mockResponse({
  status = 200,
  text = "",
  ok = status >= 200 && status < 300,
}) {
  return {
    status,
    ok,
    text: async () => text,
  };
}

test("1. GET thanh cong tra ve du lieu JSON", async () => {
  globalThis.fetch = async () =>
    mockResponse({
      status: 200,
      text: JSON.stringify([{ class_id: "WEB-01" }]),
    });
  const data = await api("/sections");
  assert.deepEqual(data, [{ class_id: "WEB-01" }]);
});

test("2. AbortError duoc giu nguyen khi request bi huy", async () => {
  const abortErr = new DOMException("Aborted", "AbortError");
  globalThis.fetch = async () => {
    throw abortErr;
  };
  await assert.rejects(
    () => api("/sections"),
    (err) => err.name === "AbortError"
  );
});

test("3. Loi mang/CORS nem thong bao ro rang", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(() => api("/sections"), /Không nhận được phản hồi API/);
});

test("4. DELETE thanh cong status 204 tra ve null", async () => {
  globalThis.fetch = async () => mockResponse({ status: 204, text: "" });
  const data = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
  assert.equal(data, null);
});

test("5. Phan hoi khong phai JSON nem loi ro rang", async () => {
  globalThis.fetch = async () =>
    mockResponse({ status: 502, text: "<html>Bad Gateway</html>" });
  await assert.rejects(
    () => api("/sections"),
    /HTTP 502: phản hồi không phải JSON/
  );
});

test("6. HTTP loi voi detail dang chuoi", async () => {
  globalThis.fetch = async () =>
    mockResponse({
      status: 409,
      text: JSON.stringify({ detail: "Lop hoc phan da het cho" }),
    });
  await assert.rejects(
    () => api("/enrollments", { method: "POST" }),
    (err) => {
      assert.equal(err.status, 409);
      assert.match(err.message, /HTTP 409: Lop hoc phan da het cho/);
      return true;
    }
  );
});

test("7. HTTP loi 422 voi detail la danh sach item.msg", async () => {
  globalThis.fetch = async () =>
    mockResponse({
      status: 422,
      text: JSON.stringify({
        detail: [{ msg: "Field required" }, { msg: "Invalid format" }],
      }),
    });
  await assert.rejects(
    () => api("/enrollments", { method: "POST" }),
    /HTTP 422: Field required; Invalid format/
  );
});

test("8. POST kem body duoc JSON.stringify va co Content-Type", async () => {
  let capturedInit;
  globalThis.fetch = async (_url, init) => {
    capturedInit = init;
    return mockResponse({ status: 201, text: JSON.stringify({ ok: true }) });
  };
  await api("/enrollments", {
    method: "POST",
    body: { student_id: "22000004", class_section_id: "WEB-01" },
  });
  assert.equal(capturedInit.method, "POST");
  assert.equal(capturedInit.headers["Content-Type"], "application/json");
  assert.equal(
    capturedInit.body,
    JSON.stringify({ student_id: "22000004", class_section_id: "WEB-01" })
  );
});
